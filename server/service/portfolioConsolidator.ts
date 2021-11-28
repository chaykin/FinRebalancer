import { Portfolio, PortfolioGroup, PortfolioGroupItem } from '@prisma/client';
import { Prisma, Security } from '.prisma/client';
import TradeConsolidateService, { Consolidation } from './tradeConsolidateService';

export default class PortfolioConsolidator {

  public consolidate(tradeSrv: TradeConsolidateService, p: Portfolio & { portfolioGroups: (PortfolioGroup & { items: (PortfolioGroupItem & { security: Security & { bond: { matDate: Date } } })[] })[] }): PortfolioConsolidation {
    const groups = new Map<number, GroupConsolidation>();
    p.portfolioGroups.forEach(g => {
      const groupConsolidation = PortfolioConsolidator.createGroupConsolidation(g);
      groups.set(g.id, groupConsolidation);

      g.items.forEach(item => {
        const secConsData = tradeSrv.getSecurityConsolidation(p.code, item.securityCode);
        groupConsolidation.securities.push(PortfolioConsolidator.createSecurityConsolidation(secConsData, item));
      });
    });

    const rootGroups: GroupConsolidation[] = [];
    p.portfolioGroups.forEach(g => {
      const current = groups.get(g.id);
      if (g.parentId) {
        const parent = groups.get(g.parentId);
        parent.children.push(current);
      } else {
        rootGroups.push(current);
      }
    });

    return {
      code: p.code,
      name: p.name,
      groups: rootGroups
    };
  }

  private static createGroupConsolidation(group: PortfolioGroup): GroupConsolidation {
    return {
      name: group.groupName,
      children: [],
      targetPercent: group.targetPercent,
      securities: []
    };
  }

  private static createSecurityConsolidation(secConsData: Consolidation, groupItem: PortfolioGroupItem & { security: Security & { bond: { matDate: Date } } }): SecurityConsolidation {
    return {
      code: groupItem.securityCode,
      shortName: groupItem.security.shortName,
      fullName: groupItem.security.fullName,
      boardId: groupItem.security.boardId,
      market: groupItem.security.market,
      engine: groupItem.security.engine,
      currencyId: groupItem.security.currencyId,
      matDate: groupItem.security.bond?.matDate,
      count: secConsData.count,
      avgPrice: secConsData.avg
    };
  }
}

export type SecurityConsolidation = {
  code: string
  shortName: string
  fullName: string
  boardId: string
  market: string
  engine: string
  currencyId: string
  matDate: Date | null
  count: Prisma.Decimal
  avgPrice: Prisma.Decimal
}

export type GroupConsolidation = {
  name: string,
  children: GroupConsolidation[];
  targetPercent: Prisma.Decimal;
  securities: SecurityConsolidation[]
}

export type PortfolioConsolidation = Portfolio & {
  groups: GroupConsolidation[]
}
