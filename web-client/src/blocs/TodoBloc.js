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
  static updateName = 'updateName';
  static updateCompleted = 'updateCompleted';
}

export default class TodoBloc {
  constructor(todoService) {
    this._itemSubject = new ReplaySubject();

    const allItems = from(todoService.getAll()).pipe(
      tap(_ => console.log('BOOM', _)),
      flatMap(data => data.items),
      shareReplay()
    );

    const data = {
      items: [],
      filter: Filter.all,
    };

    this._itemObservable = concat(allItems, this._itemSubject).pipe(
      flatMap(async request => {
        if (!request.op) {
          data.items.push(request);
          return data;
        }

        switch (request.op) {
          case ItemOp.add: {
            await this._addItem(todoService, data.items, request.item);
            return data;
          }

          case ItemOp.remove: {
            await this._removeItem(todoService, data.items, request.id);
            return data;
          }

          case ItemOp.updateName: {
            await this._updateName(
              todoService,
              data.items,
              request.id,
              request.name
            );
            return data;
          }

          case ItemOp.updateCompleted: {
            await this._updateCompleted(
              todoService,
              data.items,
              request.id,
              request.completed
            );
            return data;
          }

          case ItemOp.filter: {
            data.filter = request.filter;
            return data;
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

    // this._itemObservable = concat(allItems, this._itemSubject).pipe(
    //   startWith({
    //     items: [],
    //     filter: Filter.all,
    //   }),
    //   scan(async (acc, request) => {
    //     if (!request.op) {
    //       const a = await acc;
    //       a.items.push(request);
    //       return acc;
    //     }

    //     switch (request.op) {
    //       case ItemOp.add: {
    //         const a = await acc;
    //         await this._addItem(todoService, a.items, request.item);
    //         return acc;
    //       }

    //       case ItemOp.remove: {
    //         const a = await acc;
    //         await this._removeItem(todoService, a.items, request.id);
    //         return acc;
    //       }

    //       case ItemOp.updateName: {
    //         const a = await acc;
    //         await this._updateName(
    //           todoService,
    //           a.items,
    //           request.id,
    //           request.name
    //         );
    //         return acc;
    //       }

    //       case ItemOp.updateCompleted: {
    //         const a = await acc;
    //         await this._updateCompleted(
    //           todoService,
    //           a.items,
    //           request.id,
    //           request.completed
    //         );
    //         return acc;
    //       }

    //       case ItemOp.filter: {
    //         const a = await acc;
    //         a.filter = request.filter;
    //         return acc;
    //       }

    //       default:
    //         throw new Error(`Unknown operation: "${request.op}"`);
    //     }
    //   }),
    //   flatMap(async results => {
    //     const r = await results;
    //     return {
    //       items: this._applyFilter(r.items, r.filter),
    //       filter: r.filter,
    //       activeCount: this._applyFilter(r.items, Filter.active).length,
    //     };
    //   }),
    //   shareReplay()
    // );
  }

  get items() {
    return this._itemObservable.pipe(map(results => results.items));
  }

  get activeCount() {
    return this._itemObservable.pipe(map(results => results.activeCount));
  }

  get selectedFilter() {
    return this._itemObservable.pipe(map(results => results.filter));
  }

  filter(value) {
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
      op: ItemOp.updateName,
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

  dispose() {
    this._itemSubject.complete();
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

    try {
      await service.remove(id);
    } catch (error) {
      throw new Error(error);
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

    try {
      await service.update(id, matchedItem);
    } catch (error) {
      throw new Error(error);
    }

    items[matchedIndex].name = name;
  }

  async _updateCompleted(service, items, id, completed) {
    const matchedIndex = items.findIndex(item => item.id === id);

    if (matchedIndex === -1) {
      throw new Error(`Cannot find item with ID = "${id}".`);
    }

    try {
      await service.updateCompleted(id, completed);
    } catch (error) {
      throw new Error(error);
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
