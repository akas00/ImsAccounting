export class SCHEME_MASTER {
    SCHEMENO: string;
    SCHEMEDESCRIPTION: string;
    TYPE: string;
    FROMDATE: Date;
    TODATE: Date;
    SCHEMETYPE: string;
    BUDGET: number;
    CLAIMABLE: Boolean;
    PRORATA: string;
    QPS: Boolean;
    COMBI: Boolean;
    RETAILERLEVELSCHEME: Boolean;
    BUDGETLEVEL: string;
    APPROVEDBY: string;
    APPROVEDDATE: Date;
    PCL: string;
    STATUS: Boolean;
    CreateBy: string;
    UpdatedBy: string;
}
export class SCHEME_DISCOUNT_RANGE {
    SCHEMENO: string;
    ABOVEQTY: number;
    UOM: string;
    UPTOQTYTYPE: string;
    SCHEMETYPE: string;
    VALUE: number;
}

export class SCHEME_AREA_DETAIL {
    SCHEMENO: string;
    AREA: string;
    AREATYPE: string;
    BUDGET: number;
}
export class SCHEME_BRAND_DETAIL {
    SCHEMENO: string;
    BRANDCODE: string;
    BRANDNAME: string;
    MCODE: string;
    CHANNEL: string;
    SUBTYPE: string;
}
export class SCHEME_CHANNEL_EXCLUSION {
    SCHEMENO: string;
    CHANNEL: string;
}

export class SCHEME_RETAILER_DETAIL {
    SCHEMENO: string;
    DISTRIBUTOR: string;
    RETAILERCODE: string;
    BUDGET: number;
}
export class SCHEME_SUBTYPE_EXCLUSION {
    SCHEMENO: string;
    SUBTYPE: string;
    CHANNEL: string;
}