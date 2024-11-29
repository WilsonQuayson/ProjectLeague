export interface SimplifiedChampion {
    id: number;
    name: string;
    title: string;
    blurb: string;
    tags: Tag[];
    image: {
      full: string;
      loading: string;
    };
}

export interface Champion {
    id:      number;
    name:    string;
    title:   string;
    blurb:   string;
    info:    Info;
    image:   Image;
    tags:    Tag[];
    partype: string;
    stats:   { [key: string]: number };
}

export interface Image {
    full:    string;
    loading: string;
}

export interface Info {
    attack:     number;
    defense:    number;
    magic:      number;
    difficulty: number;
}

export enum Tag {
    Assassin = "Assassin",
    Fighter = "Fighter",
    Mage = "Mage",
    Marksman = "Marksman",
    Support = "Support",
    Tank = "Tank",
}
