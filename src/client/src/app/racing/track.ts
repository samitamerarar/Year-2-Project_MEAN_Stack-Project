import { Meters } from '../types';

export class Track {

    // Width and height kinda based on
    // https://www.pzm.pl/pliki/galeria/zuzel/2013/strc13.pdf, p. 6
    public static readonly WIDTH_MAX: Meters  = 500.0;
    public static readonly HEIGHT_MAX: Meters = 500.0;

    // https://www.pzm.pl/pliki/galeria/zuzel/2013/strc13.pdf, p. 7
    public static readonly SEGMENT_WIDTH: Meters = 15.0;

}
