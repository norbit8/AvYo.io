class Rain{
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.vel = 0.1;
  }

  draw(){

  }

  update(){
    strokeWeight(3);
    stroke(255);
    line(this.x, this.y, this.x+5, this.y+10);
    this.x += this.vel/2;
    this.y += this.vel;
    this.vel *= 1.03;
  }

}
