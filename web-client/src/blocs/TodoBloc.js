import { Observable, Subject, ReplaySubject, from, merge, concat } from 'rxjs';
import { tap, filter, map, flatMap, concatMap, mergeMap } from 'rxjs/operators';

class ItemOp {
  static add = 0;
  static remove = 1;
  static filter = 2;
}

export default class TodoBloc {
  constructor(serviceUrl) {
    this._serviceUrl = serviceUrl;

    this._items = [];
    this._filteredItems = [];
    this._showAll = true;

    this._itemSubject = new ReplaySubject();
    this._completedItemSubject = new Subject();

    // this._ready = false;

    // this._readySubject = new Subject();

    // this._initialize().then(_ => {
    //   this._ready = true;
    //   this._readySubject.next(true);
    // });
  }

  // async _initialize() {
  //   const items = await this._getAll();
  //   this._items.push(...items);
  //   this._filterItems();
  // }

  async _getAllItems() {
    const items = await this._getAll();
    if (this._items.length > 0) {
      return this._items;
    }
    this._items.push(...items);

    return this._items;
  }

  get items() {
    // const allItems = from(this._getAll()).pipe(
    //   tap(items => this._items.push(...items)),
    //   tap(_ => console.log(this._items))
    // );

    const items$ = from(this._getAll()).pipe(flatMap(items => items));

    // const a = Observable.create(o => {
    //   o.next(this._items);
    // }).pipe(
    //   filter(_ => this._items.length > 0),
    //   flatMap(async newItem => {
    //     const items = await this._getAllItems();
    //     return newItem;
    //   })
    // );

    const addItem = this._itemSubject.pipe(
      filter(request => request.op === ItemOp.add),
      tap(_ => console.log('>>>>', _)),
      // map(request => {
      //   console.log('<<<<<<<<', request);
      //   return allItems;
      // }),
      map(request => request.item),
      flatMap(async todoItem => await this._add(todoItem)),
      filter(newItem => newItem),
      flatMap(async newItem => {
        const items = await this._getAllItems();
        return newItem;
      }),
      tap(newItem => this._items.push(newItem)),
      tap(_ => console.log(this._filterItems()))
      // map(_ => this._filterItems())
    );

    const removeItem = this._itemSubject.pipe(
      filter(request => request.op === ItemOp.remove),
      tap(_ => console.log('XXXXX', _)),
      map(request => request.id),
      flatMap(async id => {
        const success = await this._remove(id);
        return { success, id };
      }),
      filter(result => result.success),
      map(result => this._items.findIndex(item => item.id === result.id)),
      filter(matchedIndex => matchedIndex !== -1),
      tap(matchedIndex => this._items.splice(matchedIndex, 1))
      // map(_ => this._filterItems())
    );

    const filterItems = this._itemSubject.pipe(
      filter(request => request.op === ItemOp.filter),
      tap(_ => console.log('=====', _)),
      map(request => request.showAll),
      tap(showAll => (this._showAll = showAll))
      // map(_ => this._filterItems())
    );

    const itemOperation = merge(addItem, removeItem, filterItems);

    // return allItems.pipe(flatMap(_ => itemOperation));
    return concat(items$, itemOperation);

    // return allItems.pipe(
    //   concat(_ =>
    //     addItem.pipe(merge(_ => removeItem.pipe(merge(_ => filterItems))))
    //   )
    // );
  }

  get showAll() {
    return this._showAll;
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
    this._completedItemSubject.next(id);
  }

  // async _createObservables() {
  //   this._showAllSubject
  //     .pipe(
  //       tap(showAll => {
  //         this._showAll = showAll;
  //         this._filterItems();
  //       })
  //     )
  //     .subscribe();

  //   this._addItemSubject.pipe(
  //     filter(request => request.op === ItemOp.add),
  //     map(request => request.item),
  //     flatMap(async todoItem => await this._add(todoItem)),
  //     filter(newItem => newItem),
  //     tap(newItem => this._items.push(newItem)),
  //     tap(_ => this._filterItems())
  //   );
  //   // .subscribe(item => {
  //   //   console.log(item);
  //   //   this.completed(item.id);
  //   // });

  //   this._removeItemSubject.pipe(
  //     filter(request => request.op === ItemOp.remove),
  //     map(request => request.item.id),
  //     flatMap(async id => {
  //       const success = await this._remove(id);
  //       return { success, id };
  //     }),
  //     filter(result => result.success),
  //     map(result => this._items.findIndex(item => item.id === result.id)),
  //     filter(matchedIndex => matchedIndex !== -1),
  //     tap(matchedIndex => this._items.splice(matchedIndex, 1)),
  //     tap(_ => this._filterItems())
  //   );

  //   this._completedItemSubject.pipe(
  //     flatMap(async id => {
  //       const success = await this._completed(id);
  //       return { success, id };
  //     }),
  //     filter(result => result.success),
  //     map(result => this._items.findIndex(item => item.id === result.id)),
  //     filter(matchedIndex => matchedIndex !== -1),
  //     tap(matchedIndex => (this._items[matchedIndex].completed = true)),
  //     tap(_ => this._filterItems())
  //   );
  //   // .subscribe(_ => console.log(this._filteredItems));
  // }

  _filterItems() {
    return this._showAll
      ? this._items.slice()
      : this._items.filter(i => !i.completed);
  }

  /**
   * @returns {Promise<Object[]>}
   */
  async _getAll() {
    try {
      const res = await this._getAsync();
      return await res.json();
    } catch (error) {
      console.error('Fetch Error =\n', error);
      return [];
    }
  }

  async _add(item) {
    try {
      const res = await this._postAsync(item);

      if (res.status !== 201) {
        throw new Error(`${res.status}: ${res.statusText}`);
      }

      return await res.json();
    } catch (error) {
      console.error('Fetch Error =\n', error);
    }
  }

  async _completed(id) {
    try {
      const res = await this._patchAsync(id);

      if (res.status !== 204) {
        throw new Error(`${res.status}: ${res.statusText}`);
      }

      return true;
    } catch (error) {
      console.error('Fetch Error =\n', error);
      return false;
    }
  }

  async _remove(id) {
    try {
      const res = await this._deleteAsync(id);

      if (res.status !== 204) {
        throw new Error(`${res.status}: ${res.statusText}`);
      }

      return true;
    } catch (error) {
      console.error('Fetch Error =\n', error);
      return false;
    }
  }

  _getAsync() {
    return fetch(this._serviceUrl);
  }

  _postAsync(item) {
    return fetch(this._serviceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(item),
    });
  }

  _patchAsync(id) {
    return fetch(`${this._serviceUrl}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  }

  _deleteAsync(id) {
    return fetch(`${this._serviceUrl}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  }
}
