import { ReplaySubject, from, concat } from 'rxjs';
import {
  tap,
  map,
  flatMap,
  scan,
  startWith,
  shareReplay,
} from 'rxjs/operators';

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
        showAll: true,
      }),
      scan(async (acc, request) => {
        if (!request.op) {
          const a = await acc;
          a.items.push(request);
          return acc;
        }

        switch (request.op) {
          case ItemOp.add: {
            const item = await todoService.add(request.item);
            const a = await acc;
            a.items.push(item);
            return acc;
          }

          case ItemOp.remove: {
            const a = await acc;
            const matchedIndex = a.items.findIndex(
              item => item.id === request.id
            );

            if (matchedIndex === -1) {
              throw new Error(`Cannot find item with ID = "${request.id}".`);
            }

            const success = await todoService.remove(request.id);

            if (!success) {
              throw new Error(`Server: Failed to remove item "${request.id}".`);
            }

            a.items.splice(matchedIndex, 1);
            return acc;
          }

          case ItemOp.complete: {
            const a = await acc;
            const matchedIndex = a.items.findIndex(
              item => item.id === request.id
            );

            if (matchedIndex === -1) {
              throw new Error(`Cannot find item with ID = "${request.id}".`);
            }

            const success = await todoService.markAsComplete(request.id);

            if (!success) {
              throw new Error(
                `Server: Failed to mark item "${request.id}" as complete.`
              );
            }

            a.items[matchedIndex].completed = true;
            return acc;
          }

          case ItemOp.filter: {
            const a = await acc;
            a.showAll = request.showAll;
            return acc;
          }

          default:
            throw new Error(`Unknown operation: "${request.op}"`);
        }
      }),
      flatMap(async results => {
        const r = await results;
        return r.showAll
          ? r
          : {
              items: r.items.filter(item => item.completed),
              showAll: r.showAll,
            };
      }),
      shareReplay()
    );
  }

  get items() {
    return this._item$.pipe(map(results => results.items));
  }

  get showAll() {
    return this._item$.pipe(map(results => results.showAll));
  }

  set showAll(value) {
    this._itemSubject.next({
      op: ItemOp.filter,
      showAll: value,
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
}
