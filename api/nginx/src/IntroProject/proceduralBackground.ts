import { Component } from "../route/component.js";
import { destroyCloud, generateCloud } from "../generateIntro/generateCloud.js";
import { animateBirds, destroyBirds, generateBirds } from "../generateIntro/generateBirds.js";
import { destroyTree, generateTrees } from "../generateIntro/generateTrees.js";

export class proceduralBackground implements Component{
    private birds: HTMLElement[] = [];
    private clouds: HTMLElement[] = [];
    private rafId!: number;
    private trees: HTMLElement[] = [];

    constructor(private containerId: string, private containerCloudId: string, private count = 20) {}
    
    public init(): void{
      this.birds = generateBirds(this.containerId, this.count);
      this.rafId = animateBirds(this.birds);
      this.clouds = generateCloud(this.containerCloudId, this.count);
      this.trees = generateTrees(this.containerId, this.count);
    }




    public destroy(): void {
      destroyBirds(this.birds, this.rafId);
      destroyCloud(this.clouds);
      destroyTree(this.trees);
    }

}

