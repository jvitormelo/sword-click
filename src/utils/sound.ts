export function playSound(src: string, removeAfter: number = 300, volume = 1) {
  const audio = new Audio(src);
  audio.volume = volume;
  audio.play().then(() => {
    setTimeout(() => {
      audio.pause();
      audio.remove();
    }, removeAfter);
  });
}
