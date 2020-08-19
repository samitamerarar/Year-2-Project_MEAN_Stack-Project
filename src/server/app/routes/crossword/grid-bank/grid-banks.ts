import { Grid } from '../grid-generator/grid';
import { GridBankEasy } from './grid-bank-easy';
import { GridBankNormal } from './grid-bank-normal';
import { GridBankHard } from './grid-bank-hard';

export class GridBanks {

    private static readonly INSTANCE = new GridBanks();

    private gridBankEasy: GridBankEasy;
    private gridBankNormal: GridBankNormal;
    private gridBankHard: GridBankHard;

    public static getInstance(): GridBanks {
        return GridBanks.INSTANCE;
    }

    private constructor() {
        this.gridBankEasy = new GridBankEasy();
        this.gridBankNormal = new GridBankNormal();
        this.gridBankHard = new GridBankHard();
        this.fillup();

        const FILLUP_INTERVAL = 10000;
        setInterval(() => this.fillup(), FILLUP_INTERVAL);
    }

    public async fillup(): Promise<void> {
        await this.gridBankEasy.fillup();
        await this.gridBankNormal.fillup();
        await this.gridBankHard.fillup();
    }

    public getEasyGrid(): Promise<Grid> {
        const PROMISE = this.gridBankEasy.getGrid();
        this.fillup();
        return PROMISE;
    }

    public getNormalGrid(): Promise<Grid> {
        const PROMISE = this.gridBankNormal.getGrid();
        this.fillup();
        return PROMISE;
    }

    public getHardGrid(): Promise<Grid> {
        const PROMISE = this.gridBankHard.getGrid();
        this.fillup();
        return PROMISE;
    }

}
