import { parse } from "./parse/parse";
import { tokenizer } from "./parse/tokenizer";

//{aa as soso,qq as pp,a1 }
const token =  tokenizer(`
export let a = 5;

`)

console.log(parse(token));








// function getOffset(target: any): number {
//   if (typeof target === "number") {
//     return target;
//   }

//   let el = document.querySelector<HTMLElement>(target);
//   if (!el) {
//     throw typeof target === "string"
//       ? new Error(`Target element "${target}" not found.`)
//       : new TypeError(
//           `Target must be a Number/Selector/HTMLElement/VueComponent, received ${type(
//             target
//           )} instead.`
//         );
//   }

//   let totalOffset = 0;
//   while (el) {
//     totalOffset += el.offsetTop;
//     el = el.offsetParent as HTMLElement;
//   }

//   return totalOffset;
// }
// class AnimationFrame {
//   private isAbort = false;
//   private _abortcallback: Function = () => {};
//   abort(cb: Function) {
//     this.isAbort = true;
//     this._abortcallback = cb;
//   }
//   run(target: number, settings: { duration: number; offset: number }) {
//     const startTime = performance.now();
//     const container = document.scrollingElement;
//     const startLocation = container.scrollTop;
//     let targetLocation: number = target - settings.offset || 0;
//     let _this = this;
//     return new Promise((resolve) =>
//       requestAnimationFrame(function step(currentTime: number) {
//         if (_this.isAbort) {
//           _this._abortcallback();
//           return resolve(targetLocation);
//         }
//         const timeElapsed = currentTime - startTime;
//         const progress = Math.abs(
//           settings.duration ? Math.min(timeElapsed / settings.duration, 1) : 1
//         );
//         container.scrollTop = Math.floor(
//           startLocation +
//             (targetLocation - startLocation) * easeInOutCubic(progress)
//         );
//         const clientHeight =
//           container === document.body
//             ? document.documentElement.clientHeight
//             : container.clientHeight;
//         const reachBottom =
//           clientHeight + container.scrollTop >= container.scrollHeight;

//         if (
//           progress === 1 ||
//           (targetLocation > container.scrollTop && reachBottom)
//         ) {
//           return resolve(targetLocation);
//         }

//         requestAnimationFrame(step);
//       })
//     );
//   }
// }
// const easeInOutCubic = (t: number) =>
//   t < 0.5 ? 4 * t ** 3 : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
// let box: Array<AnimationFrame> = [];
// function goTo(target: number, settings: { duration: number; offset: number }) {
//   const af = new AnimationFrame();
//   box.forEach((afInstance) => {
//     afInstance.abort(() => {
//       box = box.filter((afInstance) => af !== afInstance);
//       console.log(box.length,"---abort");
//     });
//   });
//   box.push(af);
//   return af.run(target, settings).then((v: number) => {
//     box = box.filter((afInstance) => af !== afInstance);
//     console.log(box,"---run");
//     return v;
//   });
// }

// document.querySelectorAll(".bt").forEach((el) => {
//   el.addEventListener("click", (event) => {
//     goTo((el as HTMLElement).offsetTop, {
//       duration: 2000,
//       offset: 0,
//     });
//   });
// });
