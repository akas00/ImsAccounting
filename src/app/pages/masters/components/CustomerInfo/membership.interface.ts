
export interface TMember {
        MEMID: string;
        FNAME: string;
        MNAME: string;
        LNAME: string;
        DOB: Date;
        WAD: Date;
        OCP: string;
        OFFICE: string;
        DEG: string;
        MALE: number;
        FEMALE: number;
        BOY: number;
        GIRL: number;
        BABY: number;
        TOTAL: number;
        T_NP: string;
        T_TOLE: string;
        T_STREET: string;
        T_HOUSE: string;
        T_WARD: number;
        P_NP: string;
        P_TOLE: string;
        P_STREET: string;
        P_HOUSE: string;
        P_WARD: number;
        TEL_O: string;
        TEL_R: string;
        MOBILE: string;
        EMAIL: string;
        SALESMANID: number;
        REFERENCEBY: string;
        REG_DATE: Date;
        DURATION: number;
        VALIDITY: Date;
        SCHEMEID: string;
        FAX: string;
        POBOX: string;
        ISPOLICY: number;
        POLICYNO: string;
        ACTIVATE: number;
        EDATE: Date;
        BARCODE: string;
        PHOTO: any;
        CNO: string;
        CSERIAL: string;
        CDAMNT: string;
        CCAMNT: string;
        HASDEBITCARD: number;
        CORDER: string;
        SCOUNT: number;
        PANNo: string;
        AREA: string;
        AGENT: string;
        ACCOUNT: string;
        PARTYTYPE: string;
}

export interface Scheme {
        name: string;
}

export interface Occupation {
        name: string;
}
export interface Designation {
        name: string;
}
export interface SalesPerson {
        name: string;
}
