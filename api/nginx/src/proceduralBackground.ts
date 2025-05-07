/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   proceduralBackground.ts                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: afavier <afavier@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/06 11:10:07 by afavier           #+#    #+#             */
/*   Updated: 2025/05/07 07:17:46 by afavier          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Component } from "./component.js";
import { destroyCloud, generateCloud } from "./generateCloud.js";
import { animateBirds, destroyBirds, generateBirds } from "./generateBirds.js";

export class proceduralBackground implements Component{
    private birds: HTMLElement[] = [];
    private clouds: HTMLElement[] = [];
    private rafId!: number;

    constructor(private containerId: string, private containerCloudId: string, private count = 5) {}
    
    public init(): void{
      this.birds = generateBirds(this.containerId, this.count);
      this.rafId = animateBirds(this.birds);
      this.clouds = generateCloud(this.containerCloudId, this.count);
    }
    //ensuite les arbres et nuages



    public destroy(): void {
      destroyBirds(this.birds, this.rafId);
      destroyCloud(this.clouds);
    }

}

