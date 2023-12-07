import { CookieService } from 'angular2-cookie/core';
import { Injectable } from '@angular/core';
import { AuthService } from "./permission/index";
@Injectable()
export class AppSettings {
  //not in main api, need to add
  enableACCodeFocus = false;
  enableACNameFocus = true
  enableDateChange = true;
  public get UserwiseDivision() {
    return this.getSettingFromCache('UserwiseDivision', 1);
  }
  public get DivisionWiseWarehouse() {
    return this.getSettingFromCache('DivisionWiseWarehouse', 1);
  }
  public get MembershipMode() {
    return this.getSettingFromCache('MembershipMode', 0)
  }
  public get CentralisedMembership() {
    return this.getSettingFromCache('CentralisedMembership', 0)
  }
  public get TERMINALWISESALESAC() {
    return this.getSettingFromCache('TERMINALWISESALESAC', 0)
  }
  public get TERMINALVCHR() {
    return this.getSettingFromCache('TERMINALVCHR', 0)
  }
  public get WeightedAverageCalc() {
    return this.getSettingFromCache('WeightedAverageCalc', 0)
  }
  public get SaveReceipeInProd() {
    return this.getSettingFromCache('SaveReceipeInProd', 0)
  }
  public get BarcodeInBilling() {
    return this.getSettingFromCache('BarcodeInBilling', 0)
  }
  public get ShowBSDate() {
    return this.getSettingFromCache('ShowBSDate', 0)
  } false
  public get IsTouchDisplay() {
    return this.getSettingFromCache('IsTouchDisplay', true)
  }
  public get RMode() {
    return this.getSettingFromCache('RMode', 1)
  }
  public get VATRate() {
    return this.getSettingFromCache('VATRate', 0.13)
  }
  public get ServiceTaxRate() {
    return this.getSettingFromCache('ServiceTaxRate', 0.1)
  }
  public get RoundOffPrecision() {
    return this.getSettingFromCache('RoundOffPrecision', 0)
  }
  public get TotPrintCharPerLine() {
    return this.getSettingFromCache('TotPrintCharPerLine', 48)
  }
  public get AbbInvoiceLimitAmount() {
    return this.getSettingFromCache('AbbInvoiceLimitAmount', 5000)
  }
  public get SalesAc() {
    return this.getSettingFromCache('SalesAc', 'DI01001')
  }
  public get PurchaseAc() {
    return this.getSettingFromCache('PurchaseAc', 'DE01002')
  }
  public get SalesReturnAc() {
    return this.getSettingFromCache('SalesReturnAc', 'DI01002')
  }
  public get PurchaseReturnAc() {
    return this.getSettingFromCache('PurchaseReturnAc', 'DE01003')
  }
  public get CashAc() {
    return this.getSettingFromCache('CashAc', 'AT01002')
  }
  public get VATAc() {
    return this.getSettingFromCache('VATAc', 'LB01003')
  }
  public get DiscountAc() {
    return this.getSettingFromCache('DiscountAc', 'IE01001')
  }
  public get RoundOffAc() {
    return this.getSettingFromCache('RoundOffAc', 'IE72697')
  }
  public get ServiceTaxAc() {
    return this.getSettingFromCache('ServiceTaxAc', 'LB77830V')
  }
  public get GblMemberShipMode() {
    return this.getSettingFromCache('GblMemberShipMode', 0)
  }
  public get GblCentralMembership() {
    return this.getSettingFromCache('GblCentralMembership', 0)
  }
  public get GblBarcodeWiseBilling() {
    return this.getSettingFromCache('GblBarcodeWiseBilling', true)
  }
  public get GblSaveReceipeInProd() {
    return this.getSettingFromCache('GblSaveReceipeInProd', 0)
  }
  public get EnableIndItemSalesManTag() {
    return this.getSettingFromCache('EnableIndItemSalesManTag', false)
  }
  public get GblShowBSDate() {
    return this.getSettingFromCache('GblShowBSDate', true)
  }
  public get GblTerminalWiseVoucher() {
    return this.getSettingFromCache('GblTerminalWiseVoucher', 0)
  }
  public get GblTerminalWiseSalesAc() {
    return this.getSettingFromCache('GblTerminalWiseSalesAc', 0)
  }
  public get Parent_Code_Of_RMD_ACLIST_For_SalesTerminal() {
    return this.getSettingFromCache('Parent_Code_Of_RMD_ACLIST_For_SalesTerminal', 'GOD')
  }
  public get GblProductWiseServiceCharge() {
    return this.getSettingFromCache('GblProductWiseServiceCharge', 0)
  }
  public get GblReplaceIndividualWithFlat() {
    return this.getSettingFromCache('GblReplaceIndividualWithFlat', 0)
  }
  public get GblSaveSeperateDiscountAccountInPurchase() {
    return this.getSettingFromCache('GblSaveSeperateDiscountAccountInPurchase', 0)
  }
  public get GblWeightedAverageCalc() {
    return this.getSettingFromCache('GblWeightedAverageCalc', 0)
  }
  public get GblShowSubledger() {

    return this.getSettingFromCache('GblShowSubledger', 1)
  }
  public get enableSubLedger() {
    return this.getSettingFromCache('enableSubLedger', false)
  }
  public get MultiWarehousePerTransaction() {
    return this.getSettingFromCache('MultiWarehousePerTransaction', 0)
  }
  public get AccountForBalancingOpeningBalance() {
    return this.getSettingFromCache('AccountForBalancingOpeningBalance', 'AT01002')
  }
  public get MultiplePurchaseAccount() {
    return this.getSettingFromCache('MultiplePurchaseAccount', 0)
  }
  public get GblShowPurchaseTypeAccount() {
    return this.getSettingFromCache('GblShowPurchaseTypeAccount', 0)
  }

  public get ShowBarcodeField() {
    return this.getSettingFromCache('ShowBarcodeField', 1)
  }
  public get GblEnableMCat1() {
    return this.getSettingFromCache('GblEnableMCat1', 0)
  }
  public get GblEnableMaxSQty() {
    return this.getSettingFromCache('GblEnableMaxSQty', 0)
  }
  public get GblItemWiseWarehouse() {
    return this.getSettingFromCache('GblItemWiseWarehouse', 0)
  }
  public get GblManualCode() {
    return this.getSettingFromCache('GblManualCode', 0)
  }
  public get GblDuplicateItem() {
    return this.getSettingFromCache('GblDuplicateItem', 0)
  }
  public get GblDuplicateGroup() {
    return this.getSettingFromCache('GblDuplicateGroup', 0)
  }
  public get GblEnableRateDiscount() {
    return this.getSettingFromCache('GblEnableRateDiscount', 1)
  }
  public get GblMultiBrandModel() {
    return this.getSettingFromCache('GblMultiBrandModel', 0)
  }
  public get GblEnableBarcodeDetails() {
    return this.getSettingFromCache('GblEnableBarcodeDetails', 0)
  }
  public get GblDivisionWiseBarcodeListing() {
    return this.getSettingFromCache('GblDivisionWiseBarcodeListing', 0)
  }
  public get GblAUTOBARCODEFROMPURCHASE() {
    return this.getSettingFromCache('GblAUTOBARCODEFROMPURCHASE', 0)
  }
  public get enableCostCenter() {
    return this.getSettingFromCache('enableCostCenter', true)
  }
  public get enableChequeInEntry() {
    return this.getSettingFromCache('enableChequeInEntry', false)
  }

  public get enableBranch() {
    return this.getSettingFromCache('enableBranch', true)
  }
  public get ENABLEMULTICURRENCY() {
    return this.getSettingFromCache('ENABLEMULTICURRENCY', 0)
  }
  public get DefaultDivision() {
    if (this.UserwiseDivision == 1) {
      return this.getUserSettingFromCache("userDivision", '');
    }
    let Cookie = this.authservice.getCookie();
    let div
    if (Cookie != null) {
      let div = Cookie.Division
    }
    if (div) {
      return div;
    }
    return this.getSettingFromCache('DefaultDivision', 'MMX');
  }
  public get DefaultWarehouse() {
    if (this.DivisionWiseWarehouse == 1) {
      return this.getUserSettingFromCache('userWarehouse', '');
    }

    let Cookie = this.authservice.getCookie();
    let war;
    if (Cookie != null) { war = Cookie.Warehouse }
    if (war) {
      return war
    }
    return this.getSettingFromCache('DefaultWarehouse', 'Main Warehouse')
  }
  public get userDivisionList() {
    var defDiv = this.DefaultDivision;
    return this.getUserSettingFromCache("divisions", [defDiv]);
  }
  public get userWarehouseList() {
    var defware = this.DefaultWarehouse;
    return this.getUserSettingFromCache('warehouses', [defware]);
  }
  public get AppSalesBillType() {
    return this.getSettingFromCache('AppSalesBillType', 0)
  }
  public get AppWithServiceTax() {
    return this.getSettingFromCache('AppWithServiceTax', 0)
  }
  public get AppServiceTaxType() {
    return this.getSettingFromCache('AppServiceTaxType', 1)
  }
  public get DivisionWiseSalesBillNo() {
    return this.getSettingFromCache('DivisionWiseSalesBillNo', false)
  }
  public get CouterWiseSalesBillNo() {
    return this.getSettingFromCache('CouterWiseSalesBillNo', false)
  }
  public get GblDisplayServiceTax() {
    return this.getSettingFromCache('GblDisplayServiceTax', 0)
  }
  public get GblDisplayVAT() {
    return this.getSettingFromCache('GblDisplayVAT', false)
  }
  public get GblVatName() {
    return this.getSettingFromCache('GblVatName', 'GST')
  }
  public get GblRateMode() {
    return this.getSettingFromCache('GblRateMode', 0)
  }
  public get EnableVoucherSeries() {
    return this.getSettingFromCache('EnableVoucherSeries', 0)
  }
  public get EnableMultiFiscalYear() {
    return this.getSettingFromCache('EnableMultiFiscalYear', false)
  }
  public get GblEnableServiceCharge() {
    return this.getSettingFromCache('GblEnableServiceCharge', 0)
  }
  public get EnableRepeatedProduct() {
    return this.getSettingFromCache('EnableRepeatedProduct', 0)
  }
  public get EnableZeroRate() {
    return this.getSettingFromCache('EnableZeroRate', 0)
  }
  public get EnableCompulsoryBarcode() {
    return this.getSettingFromCache('EnableCompulsoryBarcode', 0)
  }
  public get EnablePurchaseBillCorrection() {
    return this.getSettingFromCache('EnablePurchaseBillCorrection', 0)
  }
  public get EnableCompulsoryPartyInTransaction() {
    return this.getSettingFromCache('EnableCompulsoryPartyInTransaction', 1)
  }
  public get EnableProductCondition() {
    return this.getSettingFromCache('EnableProductCondition', 0)
  }
  public get EnableCostCenter() {
    return this.getSettingFromCache('EnableCostCenter', 0)
  }
  public get GblShowItemButtons() {
    return this.getSettingFromCache('GblShowItemButtons', false)
  }
  public get HasExpiryDateInItem() {
    return this.getSettingFromCache('HasExpiryDateInItem', 0)
  }

  public get HasItemTypeInItem() {
    return this.getSettingFromCache('HasItemTypeInItem', 0)
  }
  public get ConsumptionAccount() {
    return this.getSettingFromCache('ConsumptionAccount', 'DE15507V')
  }
  public get SALESTYPE() {
    return this.getSettingFromCache('SALESTYPE', 'counter')
  }
  public get SGST_PAYABLE() {
    return this.getSettingFromCache('SGST_PAYABLE', 'LB1418')
  }
  public get SGST_RECEIVABLE() {
    return this.getSettingFromCache('SGST_RECEIVABLE', 'AT1433')
  }
  public get IGST_PAYABLE() {
    return this.getSettingFromCache('IGST_PAYABLE', 'LB1420')
  }
  public get IGST_RECEIVABLE() {
    return this.getSettingFromCache('IGST_RECEIVABLE', 'AT1431')
  }
  public get CGST_PAYABLE() {
    return this.getSettingFromCache('CGST_PAYABLE', 'LB1419')
  }
  public get CGST_RECEIVABLE() {
    return this.getSettingFromCache('CGST_RECEIVABLE', 'AT1432')
  }
  public get SGST_PAYABLE_RCM() {
    return this.getSettingFromCache('SGST_PAYABLE_RCM', 'LB1428')
  }
  public get SGST_RECEIVABLE_RCM() {
    return this.getSettingFromCache('SGST_RECEIVABLE_RCM', 'AT1436                                                         ')
  }
  public get IGST_PAYABLE_RCM() {
    return this.getSettingFromCache('IGST_PAYABLE_RCM', 'LB1427')
  }
  public get IGST_RECEIVABLE_RCM() {
    return this.getSettingFromCache('IGST_RECEIVABLE_RCM', 'AT1434')
  }
  public get CGST_PAYABLE_RCM() {
    return this.getSettingFromCache('CGST_PAYABLE_RCM', 'LB1429')
  }
  public get CGST_RECEIVABLE_RCM() {
    return this.getSettingFromCache('CGST_RECEIVABLE_RCM', 'AT1435')
  }
  public get directCashCounterSales() {
    return this.getSettingFromCache('directCashCounterSales', 0)
  }

  public get APPTYPE() {
    return this.getSettingFromCache('APPTYPE', 0)
} 
  constructor(private authservice: AuthService) {

  }

  setSetting(settings) {
    for (var property in this) {
      if (this.hasOwnProperty(property)) {
        this[property] = settings[property];
      }
    }
  }

  getSettingFromCache(prop: string, defaultvalue: any) {
    let setting = this.authservice.getSetting();
    if (setting) {
      var ret = setting[prop];
      return ret;
    }
    return defaultvalue;

  }

  getUserSettingFromCache(prop: string, defaultvalue: any) {
    let userProfile = this.authservice.getUserProfile();
    if (userProfile) {
      var ret = userProfile[prop];
      return ret;
    }
    return defaultvalue;
  }
  getSettingFromCookie(prop: string, defaultvalue: any) {

    let Cookie = this.authservice.getCookie();
    if (Cookie) {
      var ret = Cookie.prop[prop];
      return ret;
    }
    return defaultvalue;
  }

}
