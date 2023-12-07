import { Component, OnInit } from '@angular/core';
import { CacheService } from '../../common/services/permission';
@Component({
    selector: 'pages-footer',
    template: `
    <footer class="al-footer clearfix sticky-footer">
    <table cellpadding="0" cellspacing="0" class="wms-cd">
    <colgroup>
    <col>
    </colgroup>
    <tbody>
      <tr>
        <td style="text-align:left;" class="copyright">
          <span style="margin-left:3px;font-size:11px;color:#000;">Powered by IMS</span>
        </td> 
        <td>Account V6.1.1</td> 
        <td class="wpusname trans-Status">
          <span class="wp-hdr-login">Company </span>
          <span class="wp-hdr-login-txt">{{loggedInUserDetail.CompanyInfo.NAME}} </span> 
          <span class="wp-hdr-login">Location </span> 
          <span class="wp-hdr-login-txt">{{loggedInUserDetail.CompanyInfo.ADDRESS}} </span> 
          <span class="wp-hdr-login">Login User </span> 
          <span class="wp-hdr-login-txt">{{loggedInUserDetail.username}} </span> 
          
        
        </td>
      </tr>
     </tbody>
     </table>
    </footer>
    `,
    styles: [
        `
        
.wms-cd{
    z-index: 100;
    border-top: 1px solid #cacaca;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 21px;
    text-decoration: none;
    color: #666;
    background: #dadada left top;
    background-attachment: scroll;
    text-align: right;
  }
  
  .wp-hdr-login {
    font-size: 11px;
    font-style: normal;
    padding-left: 3px;
    color: #666;
    font-weight: 700;
  }
  .wpusname {
    display: inline;
    line-height: 20px;
    text-align: right;
    padding-right: 5px;
  }
        `
    ]
})
export class Footer implements OnInit {
    public loggedInUserDetail: any
    constructor(private cacheService: CacheService) {

    }
    ngOnInit() {
        this.loggedInUserDetail = this.cacheService.get('USER_PROFILE')
    }
}
