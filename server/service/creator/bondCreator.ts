import SecurityCreator from './securityCreator';
import { MoexJsonResults } from '../../moexapi/jsonresults/MoexJsonResults';
import { Board } from '../../model/Board';
import { Security } from '.prisma/client';
import { BondizationFetcher } from '../../moexapi/fetchers/BondizationFetcher';
import { BondMarketdataFetcher } from '../../moexapi/fetchers/BondMarketdataFetcher';
import PrismaMan from '../../prisma/PrismaMan';
import { BondMarketdata } from '../../model/Bond';
import { Bond, Prisma } from '@prisma/client';

const TYPE_NAME_VAL = 'TYPENAME';
const FACEVALUE_VAL = 'FACEVALUE';
const MAT_DATE_VAL = 'MATDATE';

export default class BondCreator extends SecurityCreator {

  createOrUpdate(code: string, group: string, data: { description: MoexJsonResults<string>; board: Board }): Promise<Security> {
    const securityPromise = super.createOrUpdate(code, group, data);
    const bondizationPromise = new BondizationFetcher().fetchBondization(code, data.board);
    const marketdataPromise = new BondMarketdataFetcher().fetchMarketdata(code, data.board);

    return Promise.all([securityPromise, bondizationPromise, marketdataPromise]).then(r => {
      const bond = this.mapToBond(r[0], r[1], r[2], data);

      const prisma = PrismaMan.getPrisma();
      return prisma.bond.upsert({
        create: bond,
        update: bond,
        where: { securityCode: code }
      }).then(() => r[0]);
    });
  }

  private mapToBond(security: Security, bondization: number, marketdata: BondMarketdata, data: { description: MoexJsonResults<string>, board: Board }): Bond {
    return {
      securityCode: security.code,
      bondType: this.extractField(data.description, TYPE_NAME_VAL),
      faceValue: new Prisma.Decimal(this.extractField(data.description, FACEVALUE_VAL)),
      accruedInterest: new Prisma.Decimal(marketdata.accruedInt),
      matDate: new Date(this.extractField(data.description, MAT_DATE_VAL)),
      bondization: new Prisma.Decimal(bondization)
    };
  }
}