class Star {
  constructor(wd, he) {
    this.w = wd;
    this.h = he;
    this.duration = 10;
  }

  show() {
    fill(255, 204, 0);
    strokeWeight(4);
    point(this.w, this.h);
  }
}
