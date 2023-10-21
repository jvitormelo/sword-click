export function playSound(src: string, removeAfter: number = 300) {
  const audio = new Audio(src);
  audio.play();

  setTimeout(() => {
    audio.pause();
    audio.remove();
  }, removeAfter);
}
