class Star {
  constructor(wd, he) {
    this.w = w;
    this.h = h;
    this.duration = 10;
  }

  show() {
    fill(255, 204, 0);
    strokeWeight(4);
    point(this.w, this.h);
  }
}
