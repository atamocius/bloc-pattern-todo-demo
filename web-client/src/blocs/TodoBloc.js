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
  static complete = 'complete';
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
            // const item = await todoService.add(request.item);
            // a.items.push(item);
            return acc;
          }

          case ItemOp.remove: {
            const a = await acc;
            await this._removeItem(todoService, a.items, request.id);
            // const matchedIndex = a.items.findIndex(
            //   item => item.id === request.id
            // );

            // if (matchedIndex === -1) {
            //   throw new Error(`Cannot find item with ID = "${request.id}".`);
            // }

            // const success = await todoService.remove(request.id);

            // if (!success) {
            //   throw new Error(`Server: Failed to remove item "${request.id}".`);
            // }

            // a.items.splice(matchedIndex, 1);
            return acc;
          }

          case ItemOp.complete: {
            const a = await acc;
            await this._markAsCompleted(todoService, a.items, request.id);
            // const matchedIndex = a.items.findIndex(
            //   item => item.id === request.id
            // );

            // if (matchedIndex === -1) {
            //   throw new Error(`Cannot find item with ID = "${request.id}".`);
            // }

            // const success = await todoService.markAsComplete(request.id);

            // if (!success) {
            //   throw new Error(
            //     `Server: Failed to mark item "${request.id}" as complete.`
            //   );
            // }

            // a.items[matchedIndex].completed = true;
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
          items: this._applyFilter(r, r.filter),
          filter: r.filter,
        };
      }),
      shareReplay()
    );
  }

  get items() {
    return this._item$.pipe(map(results => results.items));
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

  completed(id) {
    this._itemSubject.next({
      op: ItemOp.complete,
      id,
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

  async _markAsCompleted(service, items, id) {
    const matchedIndex = items.findIndex(item => item.id === id);

    if (matchedIndex === -1) {
      throw new Error(`Cannot find item with ID = "${id}".`);
    }

    const success = await service.markAsComplete(id);

    if (!success) {
      throw new Error(`Server: Failed to mark item "${id}" as complete.`);
    }

    items[matchedIndex].completed = true;
  }

  _applyFilter(items, filter) {
    switch (filter) {
      case Filter.active:
        return items.filter(i => !i.done);

      case Filter.completed:
        return items.filter(i => i.done);

      default:
        // Filter.all
        return items;
    }
  }
}
