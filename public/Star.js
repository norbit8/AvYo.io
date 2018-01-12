class Star {
  constructor(wd, he) {
    this.w = wd;
    this.h = he;
    this.duration = 11;
    this.ran = 0;
    this.v = createVector(this.h, this.w);
  }

  show() {
    this.ran = random(3, -3);
    this.w += this.ran;
    this.h += this.ran;
    this.v = createVector(this.w, this.h);
    fill(128, 0, 128);
    noStroke();
    ellipse(this.w, this.h, 50, 50);
    if (this.duration % 2 == 0) {
      fill(255, 255, 255, random(0, 100));
      ellipse(this.w, this.h, 49, 49);
    }
  }
}
