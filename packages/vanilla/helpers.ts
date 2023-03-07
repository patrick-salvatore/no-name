export function renderRoute(Comp: (...T) => string, lifeCycles) {
  return (...arg) =>
    lifeCycles.onMount(...arg).then((d) => {
      return Comp(d, ...arg);
    });
}
