// import { defer } from 'rxjs';
// import { flatMap, scan, startWith, retryWhen, delay } from 'rxjs/operators';

// export const retryDelay = (retries, timeDelay) =>
//   retryWhen(errors =>
//     errors.pipe(
//       delay(timeDelay),
//       startWith(1),
//       scan((count, currentErr) => {
//         console.warn('Retry #', count);
//         // console.log(`${count} >= ${retries}`, count >= retries);
//         if (count >= retries) {
//           // console.warn('NO MORE TRIES');
//           throw currentErr;
//         } else {
//           return (count += 1);
//         }
//       })
//     )
//   );

// export const retryableAsync = (funcAsync, retries = 3, timeDelay = 500) =>
//   defer(funcAsync)
//     .pipe(
//       flatMap(async x => await x),
//       retryDelay(retries, timeDelay)
//     )
//     .toPromise();

export const retryableAsync = async (
  asyncFunc,
  retries = 3,
  timeDelay = 500
) => {
  let retryCount = 0;

  while (retryCount < retries) {
    console.log(`Attempt #${retryCount}`);
    try {
      return await asyncFunc();
    } catch (error) {
      console.log(`Failed attempt #${retryCount}`);
      await Promise.delay(timeDelay);
      retryCount++;
    }
  }
};
