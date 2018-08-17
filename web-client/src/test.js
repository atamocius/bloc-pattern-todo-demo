import shortid from 'shortid';

import {
  Observable,
  Subject,
  ReplaySubject,
  from,
  merge,
  of,
  concat,
  empty,
  defer,
} from 'rxjs';
import {
  tap,
  filter,
  map,
  flatMap,
  concatMap,
  mergeMap,
  reduce,
  scan,
  startWith,
  mergeScan,
  retry,
  retryWhen,
  delay,
  delayWhen,
} from 'rxjs/operators';

export default function run() {
  const retryDelay = (retries, timeDelay) =>
    retryWhen(error$ =>
      error$.pipe(
        delay(timeDelay),
        startWith(1),
        scan((count, currentErr) => {
          console.warn('TRY #', count);
          console.log(`${count} >= ${retries}`, count >= retries);
          if (count >= retries) {
            console.warn('NO MORE TRIES');
            throw currentErr;
          } else {
            return (count += 1);
          }
        })
      )
    );

  const retryableAsync = (funcAsync, retries = 3, timeDelay = 500) =>
    defer(funcAsync)
      .pipe(
        flatMap(async x => await x),
        retryDelay(retries, timeDelay)
      )
      .toPromise();

  // const toPromise = obs =>
  //   new Promise((resolve, reject) => {
  //     let value;
  //     obs.subscribe({
  //       next: x => (value = x),
  //       error: reject,
  //       complete: () => resolve(value),
  //     });
  //   });

  let index = 0;
  const testAsync = () => {
    console.log('Called at index', index);
    const values = [false, false, false, false, true];
    const curr = values[index];
    index++;

    return curr ? Promise.resolve(1) : Promise.reject('Some error!');
  };

  // retryableAsync$(() => testAsync()).subscribe(
  //   x => console.log('Next: ', x),
  //   err => console.log('Error: ', err),
  //   () => console.log('Completed')
  // );

  retryableAsync(() => testAsync(), 4, 2000)
    .then(x => console.log('Next: ', x))
    .catch(err => console.log('Error: ', err));

  // // const testAsync = () => Promise.resolve(true);
  // let index = 0;
  // const testAsync = () => {
  //   const values = [true, true, false, true];
  //   return Promise.resolve(values[index++]);
  // };
  // // const testAsync = () =>
  // //   from(testPromise())
  // //     .pipe(
  // //       tap(v => console.log(v)),
  // //       retryDelay(3, 2000)
  // //     )
  // //     .toPromise();

  // const testSubject$ = new ReplaySubject();

  // testSubject$
  //   .pipe(
  //     startWith([]),
  //     scan(async (acc, val) => {
  //       const success = await testAsync();
  //       if (!success) {
  //         throw new Error('Failed');
  //       }

  //       if (success) {
  //         const a = await acc;
  //         a.push(val);
  //       }
  //       return acc;

  //       // if (success) {
  //       //   const a = await acc;
  //       //   a.push(val);
  //       //   return acc;
  //       // }

  //       // throw new Error('Failed');
  //     }),
  //     flatMap(async values => await values),
  //     retryDelay(3, 2000)
  //   )
  //   .subscribe(
  //     values => console.log('VALUES', values),
  //     error => console.error('XXXXX', error)
  //   );

  // testSubject$.next(1);
  // testSubject$.next(2);
  // testSubject$.next(3);
  // testSubject$.next(4);

  //-----------------------------------------

  // const sampleIds = Array(10)
  //   .fill()
  //   .map(_ => shortid());
  // console.log(sampleIds);

  // let idCount = 0;
  // const getId = () => {
  //   return sampleIds[idCount++];
  // };

  // const items = [
  //   {
  //     id: getId(),
  //     name: 'item1',
  //     completed: false,
  //   },
  //   {
  //     id: getId(),
  //     name: 'item2',
  //     completed: false,
  //   },
  //   {
  //     id: getId(),
  //     name: 'item3',
  //     completed: false,
  //   },
  // ];

  // const getItems = () => of(items).toPromise();

  // const addItem = item =>
  //   Observable.create(o => {
  //     o.next(item);
  //     o.complete();
  //   })
  //     .pipe(
  //       map(item => {
  //         item.id = getId();
  //         return item;
  //       }),
  //       tap(item => console.log('ADD >>>', item))
  //     )
  //     .toPromise();

  // const removeItem = id =>
  //   Observable.create(o => {
  //     o.next(id);
  //     o.complete();
  //   })
  //     .pipe(
  //       tap(id => console.log('REMOVE >>>', id)),
  //       map(_ => false)
  //     )
  //     .toPromise();

  // const completeItem = id =>
  //   Observable.create(o => {
  //     o.next(id);
  //     o.complete();
  //   })
  //     .pipe(
  //       tap(id => console.log('COMPLETE >>>', id)),
  //       map(_ => true)
  //     )
  //     .toPromise();

  // // addItem({
  // //   id: 100,
  // //   name: 'item100',
  // //   completed: false,
  // // }).then();

  // // getItems().then(x => console.log(x));

  // // from(getItems()).subscribe(x => console.log(x));

  // const itemSubject$ = new ReplaySubject();

  // // Observable.create(o => {
  // //   o.next(items);
  // //   // o.complete();
  // // })
  // // const s = subject.pipe(
  // //   // tap(_ => console.log(_)),
  // //   tap(val => items.push(val))
  // //   // tap(val => console.log(val))
  // // );

  // // from(items).subscribe(x => console.log(x));
  // const items$ = from(getItems()).pipe(
  //   tap(_ => console.log('BOOM')),
  //   flatMap(items => items)
  // );

  // // .subscribe(x => console.log('>>', x));

  // // const addItem$ = itemSubject$.pipe(
  // //   filter(request => request.op === 'add'),
  // //   map(request => request.item)
  // // );

  // // const removeItem$ = itemSubject$.pipe(
  // //   filter(request => request.op === 'remove'),
  // //   map(request => request.id),
  // //   filter(id => )
  // // );

  // concat(items$, itemSubject$)
  //   .pipe(
  //     startWith({
  //       items: [],
  //       showAll: true,
  //     }),
  //     scan(async (acc, request) => {
  //       if (!request.op) {
  //         const a = await acc;
  //         a.items.push(request);
  //         return acc;
  //       }

  //       switch (request.op) {
  //         case 'add': {
  //           const item = await addItem(request.item);
  //           const a = await acc;
  //           a.items.push(item);
  //           return acc;
  //         }

  //         case 'remove': {
  //           const a = await acc;
  //           const matchedIndex = a.items.findIndex(
  //             item => item.id === request.id
  //           );

  //           if (matchedIndex === -1) {
  //             throw new Error(`Cannot find item with ID = "${request.id}".`);
  //           }

  //           const success = await removeItem(request.id);

  //           if (!success) {
  //             throw new Error(`Server: Failed to remove item "${request.id}".`);
  //           }

  //           a.items.splice(matchedIndex, 1);
  //           return acc;
  //         }

  //         case 'complete': {
  //           const a = await acc;
  //           const matchedIndex = a.items.findIndex(
  //             item => item.id === request.id
  //           );

  //           if (matchedIndex === -1) {
  //             throw new Error(`Cannot find item with ID = "${request.id}".`);
  //           }

  //           const success = await completeItem(request.id);

  //           if (!success) {
  //             throw new Error(
  //               `Server: Failed to mark item "${request.id}" as complete.`
  //             );
  //           }

  //           a.items[matchedIndex].completed = true;
  //           return acc;
  //         }

  //         case 'filter': {
  //           const a = await acc;
  //           a.showAll = request.showAll;
  //           return acc;
  //         }

  //         default:
  //           throw new Error(`Unknown operation: "${request.op}"`);
  //       }
  //     }),
  //     flatMap(async results => {
  //       const r = await results;
  //       // console.log('results +++++', JSON.parse(JSON.stringify(r)));
  //       return r.showAll ? r.items : r.items.filter(item => item.completed);
  //     }),
  //     retryDelay(3, 2000)
  //   )
  //   .subscribe(
  //     val => {
  //       console.log('SUB:::', JSON.parse(JSON.stringify(val)));
  //     },
  //     err => {
  //       console.error(err);
  //     }
  //   );

  // itemSubject$.next({
  //   op: 'add',
  //   item: {
  //     name: 'item4',
  //     completed: false,
  //   },
  // });
  // itemSubject$.next({
  //   op: 'add',
  //   item: {
  //     name: 'item5',
  //     completed: false,
  //   },
  // });
  // itemSubject$.next({
  //   op: 'add',
  //   item: {
  //     name: 'item6',
  //     completed: false,
  //   },
  // });
  // itemSubject$.next({
  //   op: 'remove',
  //   id: sampleIds[3],
  // });

  // itemSubject$.next({
  //   op: 'complete',
  //   id: sampleIds[4],
  // });

  // itemSubject$.next({
  //   op: 'filter',
  //   showAll: false,
  // });
  // itemSubject$.next({
  //   op: 'filter',
  //   showAll: true,
  // });

  // from(items)
  //   .pipe(
  //     tap(val => items.push(val)),
  //     tap(val => console.log(val))
  //   )
  //   .subscribe();

  // const subject = new Subject();
  // from(items)
  //   .pipe(
  //     concat(subject),
  //     tap(val => items.push(val))
  //     // tap(val => console.log(val))
  //   )
  //   .subscribe(val => console.log(val));

  // subject.next(1);
  // subject.next(2);
  // subject.next(3);

  // subject.next(1);
  // subject.next(2);
  // subject.next(3);
}
