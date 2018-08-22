import { ReplaySubject, from, concat } from 'rxjs';
import {
  tap,
  map,
  flatMap,
  scan,
  startWith,
  shareReplay,
} from 'rxjs/operators';

class Filter {
  static all = 'all';
  static active = 'active';
  static completed = 'completed';
}

class ItemOp {
  static add = 'add';
  static remove = 'remove';
  static filter = 'filter';
  static update = 'update';
  static updateCompleted = 'updateCompleted';
}

export default class TodoBloc {
  constructor(todoService) {
    this._itemSubject = new ReplaySubject();

    const allItems = from(todoService.getAll()).pipe(
      tap(_ => console.log('BOOM', _)),
      flatMap(items => items),
      shareReplay()
    );

    this._item$ = concat(allItems, this._itemSubject).pipe(
      startWith({
        items: [],
        filter: Filter.all,
      }),
      scan(async (acc, request) => {
        if (!request.op) {
          const a = await acc;
          a.items.push(request);
          return acc;
        }

        switch (request.op) {
          case ItemOp.add: {
            const a = await acc;
            await this._addItem(todoService, a.items, request.item);
            return acc;
          }

          case ItemOp.remove: {
            const a = await acc;
            await this._removeItem(todoService, a.items, request.id);
            return acc;
          }

          case ItemOp.update: {
            const a = await acc;
            await this._updateName(
              todoService,
              a.items,
              request.id,
              request.name
            );
            return acc;
          }

          case ItemOp.updateCompleted: {
            const a = await acc;
            await this._updateCompleted(
              todoService,
              a.items,
              request.id,
              request.completed
            );
            return acc;
          }

          case ItemOp.filter: {
            const a = await acc;
            a.filter = request.filter;
            return acc;
          }

          default:
            throw new Error(`Unknown operation: "${request.op}"`);
        }
      }),
      flatMap(async results => {
        const r = await results;
        return {
          items: this._applyFilter(r.items, r.filter),
          filter: r.filter,
          activeCount: this._applyFilter(r.items, Filter.active).length,
        };
      }),
      shareReplay()
    );
  }

  get items() {
    return this._item$.pipe(map(results => results.items));
  }

  get activeCount() {
    return this._item$.pipe(map(results => results.activeCount));
  }

  get filter() {
    return this._item$.pipe(map(results => results.filter));
  }

  set filter(value) {
    this._itemSubject.next({
      op: ItemOp.filter,
      filter: value,
    });
  }

  add(item) {
    this._itemSubject.next({
      op: ItemOp.add,
      item,
    });
  }

  remove(id) {
    this._itemSubject.next({
      op: ItemOp.remove,
      id,
    });
  }

  updateName(id, name) {
    this._itemSubject.next({
      op: ItemOp.update,
      id,
      name,
    });
  }

  updateCompleted(id, completed) {
    this._itemSubject.next({
      op: ItemOp.updateCompleted,
      id,
      completed,
    });
  }

  async _addItem(service, items, newItem) {
    const newItemWithId = await service.add(newItem);
    items.push(newItemWithId);
  }

  async _removeItem(service, items, id) {
    const matchedIndex = items.findIndex(item => item.id === id);

    if (matchedIndex === -1) {
      throw new Error(`Cannot find item with ID = "${id}".`);
    }

    const success = await service.remove(id);

    if (!success) {
      throw new Error(`Server: Failed to remove item "${id}".`);
    }

    items.splice(matchedIndex, 1);
  }

  async _updateName(service, items, id, name) {
    const matchedIndex = items.findIndex(item => item.id === id);

    if (matchedIndex === -1) {
      throw new Error(`Cannot find item with ID = "${id}".`);
    }

    const matchedItem = items[matchedIndex];
    matchedItem.name = name;
    const success = await service.update(id, matchedItem);

    if (!success) {
      throw new Error(`Server: Failed to update item "${id}".`);
    }

    items[matchedIndex].name = name;
  }

  async _updateCompleted(service, items, id, completed) {
    const matchedIndex = items.findIndex(item => item.id === id);

    if (matchedIndex === -1) {
      throw new Error(`Cannot find item with ID = "${id}".`);
    }

    const success = await service.updateCompleted(id, completed);

    if (!success) {
      throw new Error(`Server: Failed to update item "${id}".`);
    }

    items[matchedIndex].completed = completed;
  }

  _applyFilter(items, filter) {
    switch (filter) {
      case Filter.active:
        return items.filter(i => !i.completed);

      case Filter.completed:
        return items.filter(i => i.completed);

      default:
        // Filter.all
        return items;
    }
  }
}
