// import SmoothScrollbar from 'smooth-scrollbar';
// import ScrollTriggerPlugin from 'vendor/smooth-scrollbar/ScrollTriggerPlugin';
// import SoftScrollPlugin from 'vendor/smooth-scrollbar/SoftScrollPlugin';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { preloadImages, calcDrawImage } from '../../site/utils/utils';

gsap.registerPlugin(ScrollTrigger);
const url = document.currentScript.src;

// Sequence trigger animation
function ScrollSequence() {
  // generate array of images paths. length = frames length
  const urls = [...new Array(162)].map(
    (value, index) =>
      `${url.substring(0, url.lastIndexOf('/'))}/clientlib-site/resources/img/${
        index + 1
      }.jpg`
  );

  // load images async
  const images = preloadImages(urls);

  const container = document.querySelector('[data-cmp-is="scrollsequence"]');
  const canvas = container.querySelector('canvas');
  const ctx = canvas.getContext('2d');

  // create "scrub" ScrollTrigger effect with pin of main block
  const tl = new gsap.timeline({
    scrollTrigger: {
      trigger: container,
      scrub: 1,
      start: 'top top',
      end: '200%', // scene duration
      pin: true,
      pinType: 'fixed',
    },
  });

  // canvas resize handler
  window.addEventListener(
    'resize',
    (function resize() {
      ctx.canvas.width = document.documentElement.clientWidth;
      ctx.canvas.height = document.documentElement.clientHeight;
      return resize;
    })()
  );

  // when all images ready
  images.then((imgs) => {
    const counter = { i: 0 }; // iteration object

    tl.to(
      counter,
      {
        i: imgs.length - 1, // increment counter to frames length
        roundProps: 'i', // round, only int
        immediateRender: true, // render first frame immediately
        onUpdate: () => calcDrawImage(ctx, imgs[counter.i]), // draw image in canvas when timeline update
      },
      0
    );

    // draw current frame again when scroll stopped and resize happened
    window.addEventListener('resize', () =>
      calcDrawImage(ctx, imgs[counter.i])
    );
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (!window.CQ.Sling) {
    return ScrollSequence();
  }
  const container = document.querySelector('[data-cmp-is="scrollsequence"]');
  const p = document.createElement('p');
  p.innerText = 'this needs to be run in view as published';
  container.appendChild(p);
});
