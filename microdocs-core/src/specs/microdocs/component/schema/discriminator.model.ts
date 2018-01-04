
export type Discriminator = { [propertyName: string]: string } | DiscriminatorModel;

export interface DiscriminatorModel {

  properyName?: string;
  mapping?: { [propertyName: string]: string };

}