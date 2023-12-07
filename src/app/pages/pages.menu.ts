export const PAGES_MENU = [
  {
    path: "pages",
    children: [
      {
        path: "dashboard",
        data: {
          menu: {
            title: "IMS-ERP",
            icon: "ion-android-home",
            selected: true,
            expanded: false,
            order: 0
          }
        },
        children: [
          {
            path: "dashboard",
            data: {
              menu: {
                title: "Dashboard",
                icon: "ion-navicon-round",
                selected: true,
                expanded: false,
                order: 0
              },

            },

          }
          // ,
          // {
          //   path: "fiscalYear",
          //   data: {
          //     menu: {
          //       icon: "glyphicon glyphicon-list-alt",
          //       title: "Fisal Year",
          //       selected: true,
          //       expanded: false,
          //       order: 0
          //     },

          //   },

          // },
          // {
          //  path: "fiscalYear",
          //       menuType: [0],

          //       data: {
          //         menu: {
          //           icon: "glyphicon glyphicon-list-alt",
          //           title: "Fisal Year"
          //         }
          //       }


          //   },


          // {
          //   path: "terminal",
          //   data: {
          //     menu: {
          //       title: "Terminal Setup",
          //       icon: "ion-gear-b",
          //       selected: false,
          //       expanded: false,
          //       order: 700
          //     }
          //   }
          // },
          // {
          //   path: "backup-restore",
          //   isOnlyCentral: true,
          //   data: {
          //     menu: {
          //       title: "Backup & Restore",
          //       icon: "ion-android-upload",
          //       selected: false,
          //       expanded: false,
          //       order: 0
          //     }
          //   }
          // }
        ]
      },
      {
        path: "account",
        menuType: [0],
        data: {
          menu: {
            title: "Financial Account",
            icon: "fa fa-usd"
          }
        },
        children: [
          {
            path: "AccountLedger",
            menuType: [0],
            data: {
              menu: {
                title: "Master Entry",
                icon: "nb-compose"
              }
            },
            children: [

              // {
              //   path: "AccountTree",
              //   menuType: [0],
              //   data: {
              //     menu: {
              //       title: "Account Master"
              //     }
              //   }
              // },
              {
                path: "AccountMaster",
                menuType: [0],
                data: {
                  menu: {
                    title: "Account Master"
                  }
                }
              },
              {
                path: "PartyTree",
                menuType: [0],
                data: {
                  menu: {
                    title: "Party Master"
                  }
                }
               },
              // {
              //   path: "chalan-master",
              //   menuType: [0],
              //   data: {
              //     menu: {
              //       title: "Chalan Master"
              //     }
              //   }
              // },

              {
                path: "cost-center-category",
                menuType: [0],
                data: {
                  menu: {
                    title : "Cost Center Category Master"
                  }
                }
              },
              {
                path: "cost-center",
                menuType: [0],
                data: {
                  menu: {
                    title : "Cost Center Master"
                  }
                }
              },
              {
                path: "subledger-master",
                menuType: [0],
                data: {
                  menu: {
                    title: "Sub Ledger Master"
                  }
                }
              },
              {
                path:"voucher-series-master",
                menuType: [0],
                data:{
                  menu:{
                    title:"Voucher Series Master"
                  }
                }
              },
              {
                path: "merchant-details",
                menuType: [0],
                data: {
                  menu: {
                    title: "Merchant CellPay Details"
                  }
                }
              },
              {
                path:"partycategory-master",
                menuType: [0],
                data:{
                  menu:{
                    title:"Party Category Master"
                  }
                }
              },

              {
                path:"budget-master",
                menuType: [0],
                data:{
                  menu:{
                    title:"Budget Master"
                  }
                }
              }


            ]
          },
          {
            path: "acvouchers",
            menuType: [0],
            data: {
              menu: {
                title: "Accounting Vouchers"
              }
            },
            children: [
              {
                path: "journal-voucher",
                menuType: [0],
                data: {
                  menu: {
                    title: "Journal Voucher"
                  }
                }
              },
              {
                path: "contra-voucher",
                menuType: [0],
                data: {
                  menu: {
                    title: "Contra Voucher"
                  }
                }
              },

            {
              path: "expense-voucher",
              menuType: [0],
              data: {
                menu: {
                  title: "Payment Voucher"
                }
              }
            },
              {
                path: "income-voucher",
                menuType: [0],
                data: {
                  menu: {
                    title: "Receipt Voucher"
                  }
                }
              },
              {
                path: "debit-note",
                menuType: [0],
                data: {
                  menu: {
                    title: "Debit Note -  AC Base"
                  }
                }
              },
              {
                path: "credit-note",
                menuType: [0],
                data: {
                  menu: {
                    title: "Credit Note - AC Base"
                  }
                }
              },
              // {
              //   path: "debit-note-rate-adjustment",
              //   data: {
              //     menu: {
              //       title: "Debit Note-Rate Adjustment"
              //     }
              //   }
              // },
              // {
              //   path: "credit-note-rate-adjustment",
              //   data: {
              //     menu: {
              //       title: "Credit Note-Rate Adjustment"
              //     }
              //   }
              // },

              {
                path: "bill-tracking",
                menuType: [0],
                data: {
                  menu: {
                    title: "Bill Tracking Amendment"
                  }
                }
              },

              // {
              //   path: "additional-cost",
              //   data: {
              //     menu: {
              //       title: "Additional Cost"
              //     }
              //   }
              // },
              {
                path: "newadditional-cost",
                menuType: [0],
                data: {
                  menu: {
                    title: "New Additional Cost"
                  }
                }
              },
              {
                path: "capital-voucher",
                menuType: [0],
                data: {
                  menu: {
                    title: "Capitalize Purchase Voucher"
                  }
                }
              },
              {
                path: "postdirectory",
                menuType: [0],
                data: {
                  menu: {
                    title: "Post-Dated Cheque Voucher"
                  }
                }
              },
              {
                path: "cellpay-voucher",
                menuType: [0],
                data: {
                  menu: {
                    title: "CellPay Voucher"
                  }
                }
              },
              {
                path: "localpurchase-costallocation",
                menuType: [0],
                data: {
                  menu: {
                    title: "Local Purchase Cost Allocation"
                  }
                }
              },
              // {
              //   path: "VehicleCostListSelector",
              //   menuType: [0],
              //   data: {
              //     menu: {
              //       title: "VehicleCosting"
              //     }
              //   }
              // },
              // {
              //   path: "reverse-credit-note",
              //   menuType: [0],
              //   data: {
              //     menu: {
              //       title: "Reverse Credit Note - AC Base"
              //     }
              //   }
              // },

              // {
              //   path: "PaymentCollection",
              //   menuType: [0],
              //   data: {
              //     menu: {
              //       title: "Payment Collection"
              //     }
              //   }
              // },
              // {
              //   path: "simpleCollection",
              //   menuType: [0],
              //   data: {
              //     menu: {
              //       title: "Simple Collection"
              //     }
              //   }
              // },



              // {
              //   path: "postdirectory",
              //   menuType: [0],
              //   data: {
              //     menu: {
              //       title: "Post Directory"
              //     }
              //   }
              // },


            ]
          },

          {
            path:"Opening",
            menuType: [0],
            data:{
               menu:{
                title:"Opening Entry"
               }
            },
            children:[

          {
            path: "account-opening-balance",
            menuType: [0],
            data: {
              menu: {
                title: "Ledger Opening B/L"
              }
            }
          },
          {
            path: "party-opening-balance",
            menuType: [0],
            data: {
              menu: {
                title: "Party Opening B/L"
              }
            }
          }
            ]
          },

          // {
          //   path: "ACPosting",
          //   menuType: [0],
          //   data: {
          //     menu: {
          //       title: "Account Posting",
          //       icon: "nb-compose"
          //     }
          //   },
          //   children: [
          //     {
          //       path: "LatePostCollection",
          //       menuType: [0],
          //       data: {
          //         menu: {
          //           title: "Late Post"
          //         }
          //       }
          //     },
          //     {
          //       path: "EPaymentStatus",
          //       menuType: [0],
          //       data: {
          //         menu: {
          //           title: "EPayment Status"
          //         }
          //       }
          //     },

          //   ]
          // },
          {
            path: "LatePostCollection",
            menuType: [0],
            data: {
              menu: {
                title: "Voucher Approval"
              }
            },
          },
          {
            path: "EPaymentStatus",
            menuType: [0],
            data: {
              menu: {
                title: "EPayment Status"
              }
            },
          },
          
          {
              path:"Utilities",
              menuType:[0],
              data:{
                menu:{
                  title: "Utilities"
                }
              },
              children:[
                {
                  path: "bank-reconciliation",
                  menuType: [0],
                  data: {
                    menu: {
                      title: "Bank Reconciliation"
                    }
                  }
                },
                {
                  path: "party-reconciliation",
                  menuType: [0],
                  data: {
                    menu: {
                      title: "Party Reconciliation"
                    }
                  }
                },
                {
                  path: "party-balance-confirmation",
                  menuType: [0],
                  data: {
                    menu: {
                      title: "Party balance Confirmation"
                    }
                  }
                },
                // {
                //   path: "PaymentCollection",
                //   menuType: [0],
                //   data: {
                //     menu: {
                //       title: "Payment Collection"
                //     }
                //   }
                // },
                {
                  path: "cash-collection",
                  menuType: [0],
                  data: {
                    menu: {
                      title: "Cash Collection"
                    }
                  }
                },
              ]
          }
        ,
        {
          path: "purchases",
          menuType: [0],
          data: {
            menu: {
              title: "Purchase",
              icon: "ion-stats-bars",
              selected: false,
              expanded: false,
              order: 3
            }
          },
          children: [
            {
              path: "add-purchase-invoice",
              menuType: [2, 3, 4],
              data: {
                menu: {
                  title: "Purchase Invoice",
                  icon: "ion-arrow-graph-up-right",
  
                  selected: false,
                  expanded: false,
                  order: 4
                }
              },
            }]
          },
          // {
          //   path: "gstr",
          //   data: {
          //     menu: {
          //       title: "GST Report"
          //     }
          //   }
          // },


          // {
          //   path: "reports",
          //   data: {
          //     menu: {
          //       title: "Additional Report",
          //       selected: false,
          //       expanded: false,
          //       order: 1
          //     }
          //   },
          //   children: [
          //     {
          //       path: "accountpayablereport",
          //       data: {
          //         menu: {
          //           title: "Account Payable Report"
          //         }
          //       }
          //     },
          //     {
          //       path: "accountreceivablereport",
          //       data: {
          //         menu: {
          //           title: "Account Receivable Report"
          //         }
          //       }
          //     }
          //   ]
          // },
          // {
          //   path: "multiple-print",
          //   menuType: [0],
          //   data: {
          //     menu: {
          //       title: "Multiple Voucher Print"
          //     }
          //   },

          // }
          {
            path:"renum",
            menuType:[0],
            data:{
              menu:{
                title: "Renumbering"
              }
            },
            children:[
              {
                path: "VoucherRenumbering",
                menuType: [0],
                data: {
                  menu: {
                    title: "Voucher Renumbering"
                  }
                }
              }
            ]
        }

        ]
      },
      // {
      //   path: "transaction",
      //   menuType: [4],
      //   data: {
      //     menu: {
      //       title: "Transactions",
      //     }
      //   },
      //   children: [
      //     {
      //       path:"purchases",
      //       menuType:[0],
      //       data:{
      //         menu:{
      //           title:"Purchases",
      //           selected:false,
      //           expanded: false
      //         }
      //       },
      //       children:[
      //         {
      //           path: "add-purchase-invoice",
      //           menuType: [0],
      //           data: {
      //             menu: {
      //               title: "Purchase Invoice",
      //               selected: false,
      //               expanded: false
      //             }
      //           }
      //         },
      //         {
      //           path: "add-debitnote-itembase",
      //           menuType: [0],
      //           data: {
      //             menu: {
      //               title: "Purchase Return"
      //             }
      //           }
      //         }
      //       ]
      //     },
      //     {
      //       path:"sales",
      //       menuType:[0],
      //       data:{
      //         menu:{
      //           title:"Sales",
      //           selected:false,
      //           expanded: false
      //         }
      //       },
      //       children:[
      //         {
      //           path: "addsientry",
      //           menuType: [0],
      //           data: {
      //             menu: {
      //               title: "Sales Invoice",
      //               selected: false,
      //               expanded: false
      //             }
      //           }
      //         },
      //         {
      //           path: "add-creditnote-itembase",
      //           menuType: [0],
      //           data: {
      //             menu: {
      //               title: "Sales Return"
      //             }
      //           }
      //         }
      //       ]
      //     }

      //   ]

      // },
      {
        path: "financialreports",
        menuType: [0],
        data: {
          menu: {
            title: "Financial Report",
            selected: false,
            expanded: false,
            order: 1
          }
        },
        children: [
          // {
          //   path: "ledger-report",
          //   data: {
          //     menu: {
          //       title: "Account Ledger",
          //       selected: false,
          //       expanded: false
          //     }
          //   }
          // },
          {
            path: "account-ledger-reports",
            menuType: [0],
            data: {
              menu: {
                title: "Ledger Report",
                selected: false,
                expanded: false
              }
            },

          children: [
            {
              path: "summaryledgerreport",
              menuType: [0],
              data: {
                menu: {
                  title: "Account Group Ledger",
                  selected: false,
                  expanded: false
                }
              }
            },
            {
              path: "accountledgerreport",
              menuType: [0],
              data: {
                menu: {
                  title: "Account Ledger Report",
                  selected: false,
                  expanded: false
                }
              }
            },
            {
              path: "summarypartyledger",
              menuType: [0],
              data: {
                menu: {
                  title: "Party Group Ledger",
                  selected: false,
                  expanded: false
                }
              }
            },
            {
              path: "partyledgerreport",
              menuType: [0],
              data: {
                menu: {
                  title: "Party Ledger Report",
                  selected: false,
                  expanded: false
                }
              }
            },
            {
              path: "sub-ledger-report-acbase",
              menuType: [0],
              data: {
                menu: {
                  title: "Sub Ledger - Summary Report",
                  selected: false,
                  expanded: false
                }
              }
            },
            {
              path: "sub-ledger-report",
              menuType: [0],
              data: {
                menu: {
                  title: "Sub Ledger - Ledger Report",
                  selected: false,
                  expanded: false
                }
              }
            },

          ]
          },
          // {
          //   path: "voucher-register",
          //   data: {
          //     menu: {
          //       title: "Voucher Register",
          //       selected: false,
          //       expanded: false
          //     }
          //   }
          // },
          // {
          //   path: "",
          //   data: {
          //     menu: {
          //       title: "Account Book",
          //       selected: false,
          //       expanded: false
          //     }
          //   },
          //   children: [
          //     {
          //       path: "day-book",
          //       menuType: [],
          //       data: {
          //         menu: {
          //           title: "Day Book",
          //           selected: false,
          //           expanded: false
          //         }
          //       }
          //     },
          //     {
          //       path: "cash-book",
          //       menuType: [],
          //       data: {
          //         menu: {
          //           title: "Cash Book",
          //           selected: false,
          //           expanded: false
          //         }
          //       }
          //     },
          //     {
          //       path: "bank-book",
          //       menuType: [],
          //       data: {
          //         menu: {
          //           title: "Bank Book",
          //           selected: false,
          //           expanded: false
          //         }
          //       }
          //     }
          //   ]
          // },

          {
            path: "additionalreport",
            menuType: [0],
            data: {
              menu: {
                title: "   Debtors & Creditors Report",
                selected: false,
                expanded: false
              }
            },
            children: [
              // {
              //   path: "accountreceivablereport",
              //   menuType: [],
              //   data: {
              //     menu: {
              //       title: "Account Receivable Report ",
              //       selected: false,
              //       expanded: false
              //     }
              //   }
              // },
              // {
              //   path: "accountpayablereport",
              //   menuType: [],
              //   data: {
              //     menu: {
              //       title: "Account Payable Report ",
              //       selected: false,
              //       expanded: false
              //     }
              //   }
              // },
              // {
              //   path: "gstsalessummary",
              //   menuType: [],
              //   data: {
              //     menu: {
              //       title: "GST Sales Summary Report ",
              //       selected: false,
              //       expanded: false
              //     }
              //   }
              // },
              // {
              //   path: "gstpurchasesummary",
              //   menuType: [],
              //   data: {
              //     menu: {
              //       title: "GST Purchase Report ",
              //       selected: false,
              //       expanded: false
              //     }
              //   }
              // },
              // {
              //   path: "agingpayable",
              //   menuType: [],
              //   data: {
              //     menu: {
              //       title: "Aging payable Report ",
              //       selected: false,
              //       expanded: false
              //     }
              //   }
              // },
              // {
              //   path: "agingreceivable",
              //   menuType: [],
              //   data: {
              //     menu: {
              //       title: "Aging Receivable Report",
              //       selected: false,
              //       expanded: false
              //     }
              //   }
              // },

              // {
              //   path: "purchasebookreport",
              //   menuType: [],
              //   data: {
              //     menu: {
              //       title: "Purchase Book Report",
              //       selected: false,
              //       expanded: false
              //     }
              //   }
              // },
              // {
              //   path: "cashbookreport",
              //   menuType: [],
              //   data: {
              //     menu: {
              //       title: "Cash Book Report",
              //       selected: false,
              //       expanded: false
              //     }
              //   }
              // },
              // {
              //   path: "salesbookreport",
              //   menuType: [],
              //   data: {
              //     menu: {
              //       title: "Sales Book Report",
              //       selected: false,
              //       expanded: false
              //     }
              //   }
              // },
              // {
              //   path: "journalbook",
              //   menuType: [],
              //   data: {
              //     menu: {
              //       title: "Journal Book Report",
              //       selected: false,
              //       expanded: false
              //     }
              //   }
              // },
              // {
              //   path: "duevoucherreport",
              //   menuType: [],
              //   data: {
              //     menu: {
              //       title: "Due Voucher Report",
              //       selected: false,
              //       expanded: false
              //     }
              //   }
              // },
              {
                path: "debtorsreport",
                menuType: [0],
                data: {
                  menu: {
                    title: "Debtors Report",
                    selected: false,
                    expanded: false
                  }
                }
              },
              {
                path: "creditorsreport",
                menuType: [0],
                data: {
                  menu: {
                    title: "Creditors Report",
                    selected: false,
                    expanded: false
                  }
                }
              },
              // {
              //   path: "PartyLedger",
              //   menuType: [],
              //   data: {
              //     menu: {
              //       title: "Party Ledger Report",
              //       selected: false,
              //       expanded: false
              //     }
              //   }
              // },
              {
                path: "debtorsagingreport",
                menuType: [0],
                data: {
                  menu: {
                    title: "Debtors Ageing Report",
                    selected: false,
                    expanded: false
                  }
                }
              },
              {
                path: "creditorsagingreport",
                menuType: [0],
                data: {
                  menu: {
                    title: "Creditors Ageing Report",
                    selected: false,
                    expanded: false
                  }
                }
              },
              {
                path: "debtorsoutstandingreport",
                menuType: [0],
                data: {
                  menu: {
                    title: "Debtors Outstanding  Report",
                    selected: false,
                    expanded: false
                  }
                }
              },
              {
                path: "creditorsoutstandingreport",
                menuType: [0],
                data: {
                  menu: {
                    title: "Creditors Outstanding  Report",
                    selected: false,
                    expanded: false
                  }
                }
              },
              {
                path: "bill-tracking-report",
                menuType: [0],
                data: {
                  menu: {
                    title: "Debtors Bill Tracking Report",
                    selected: false,
                    expanded: false
                  }
                }
              },
              {
                path: "creditorsbill-tracking-report",
                menuType: [0],
                data: {
                  menu: {
                    title: "Creditors Bill Tracking Report",
                    selected: false,
                    expanded: false
                  }
                }
              }

            ]
          },
          {
            path:"registerBookReports",
            menuType: [0],
            data:{
              menu:{
                title:"   Register & Books Report"
              }
            },
            children:[
              {
                path: "voucher-regeister-report",
                menuType: [0],
                data: {
                  menu: {
                    title: "Voucher Register  Report",
                    selected: false,
                    expanded: false
                  }
                }
              },
              {
                path: "cash-bank-book-report",
                menuType: [0],
                data: {
                  menu: {
                    title: "Cash & Bank Book Report",
                    selected: false,
                    expanded: false
                  }
                }
              },
              {
                path: "day-book-report",
                menuType: [0],
                data: {
                  menu: {
                    title: "Day Book Report",
                    selected: false,
                    expanded: false
                  }
                }
              },
              {
                path: "tds-report",
                menuType: [0],
                data: {
                  menu: {
                    title: "TDS Report",
                    selected: false,
                    expanded: false
                  }
                }
              },
              {
                path: "postdated-chequevoucher-report",
                menuType: [0],
                data: {
                  menu: {
                    title: "Post-Dated Cheque Voucher Report",
                    selected: false,
                    expanded: false
                  }
                }
              },
              {
                path: "monthly-sales-payment-report",
                menuType: [0],
                data: {
                  menu: {
                    title: "Monthly Sales Payment Report",
                    selected: false,
                    expanded: false
                  }
                }
              },
            ]
          }
          ,
          {
            path: "trialbalance",
            menuType: [0],
            data: {
              menu: {
                title: "Trial Balance",
                selected: false,
                expanded: false
              }
            },
            children:[
              {
                path: "trial-balance-report",
                menuType: [0],
                data: {
                  menu: {
                    title: "Trial Balance Report",
                    selected: false,
                    expanded: false
                  }
                }
              },
              {
                path: "consolidated-trialbalance-report",
                menuType: [0],
                data: {
                  menu: {
                    title: " Consolidated Trial Balance",
                    selected: false,
                    expanded: false
                  }
                }
              },
            ]
          },


          // budgetmenu

          {
            path: "budgetreport",
            menuType: [0],
            data: {
              menu: {
                title: "Budget Report",
                selected: false,
                expanded: false
              }
            },
            children:[
              {
                path: "actual-vs-budget-report",
                menuType: [0],
                data: {
                  menu: {
                    title: "Actual Vs Budget",
                    selected: false,
                    expanded: false
                  }
                }
              },
            
            ]
          },
          // {
          //   path:"",
          //   menuType: [0],
          //   data:{
          //     menu:{
          //       title:"   Final Report"
          //     }
          //   },
          //   children:[
          //     {
          //       path: "profit-loss",
          //       menuType: [0],
          //       data: {
          //         menu: {
          //           title: "Profit & Loss",
          //           selected: false,
          //           expanded: false
          //         }
          //       }
          //     },
          //     {
          //       path: "balance-sheet",
          //       menuType: [0],
          //       data: {
          //         menu: {
          //           title: "Balance Sheet",
          //           selected: false,
          //           expanded: false
          //         }
          //       }
          //     }
          //   ]
          // },
          {
            path:"final-report",
            menuType: [0],
            data:{
              menu:{
                title:"Final Report"
              }
            },
            children:[
              {
                path: "profit-loss-report",
                menuType: [0],
                data: {
                  menu: {
                    title: "Profit & Loss",
                    selected: false,
                    expanded: false
                  }
                }
              },
              {
                path: "balance-sheet-report",
                menuType: [0],
                data: {
                  menu: {
                    title: "Balance Sheet",
                    selected: false,
                    expanded: false
                  }
                }
              },
              {
                path: "consolidated-profit-loss-report",
                menuType: [0],
                data: {
                  menu: {
                    title: "Consolidated Profit & Loss",
                    selected: false,
                    expanded: false
                  }
                }
              },
              {
                path: "consolidated-balance-sheet-report",
                menuType: [0],
                data: {
                  menu: {
                    title: "Consolidated Balance Sheet",
                    selected: false,
                    expanded: false
                  }
                }
              },    
            ]
          },

          {
            path:"additionalcostreport",
            menuType: [0],
            data:{
              menu:{
                title:"  Additional Cost Report"
              }
            },
            children:[
              {
                path: "additionalcost-voucherwise-report",
                menuType: [0],
                data: {
                  menu: {
                    title: "Additional Cost Voucherwise Report",
                    selected: false,
                    expanded: false
                  }
                }
              },
              {
                path: "additionalcost-itemwise-report",
                menuType: [0],
                data: {
                  menu: {
                    title: "Additional Cost Itemwise Report",
                    selected: false,
                    expanded: false
                  }
                }
              },
              {
                path: "local-purchase-cost-allocation-report",
                menuType: [0],
                data: {
                  menu: {
                    title: "Local Purchase Cost Allocation Report",
                    selected: false,
                    expanded: false
                  }
                }
              },
            ]
          },
          // {
          //   path:"salesreport",
          //   menuType: [0],
          //   data:{
          //     menu:{
          //       title:"Sales Report"
          //     }
          //   },
          //   children:[
          //     {
          //       path: "salesreturnsummary-report",
          //       menuType: [0],
          //       data: {
          //         menu: {
          //           title: "Sales Return Summary Report",
          //           selected: false,
          //           expanded: false
          //         }
          //       }
          //     },
          //     {
          //       path: "salesreturnsummaryretailer-report",
          //       menuType: [0],
          //       data: {
          //         menu: {
          //           title: "Sales Return Summary Retailer Report",
          //           selected: false,
          //           expanded: false
          //         }
          //       }
          //     },
          //     {
          //       path: "salesreturn-reportdetail",
          //       menuType: [0],
          //       data: {
          //         menu: {
          //           title: "Sales Return Report Detail",
          //           selected: false,
          //           expanded: false
          //         }
          //       }
          //     },
          //   ]
          // },
          // {
          //   path:"inventoryreport-dms",
          //   menuType: [0],
          //   data:{
          //     menu:{
          //       title:"Inventory Report"
          //     }
          //   },
          //   children:[
          //   {
          //       path: "stocksummary-reportdms",
          //       menuType: [0],
          //       data: {
          //         menu: {
          //           title: "Stock Summary Report"
          //         }
          //       }
          //     },
          //     {
          //       path: "stockledger-reportdms",
          //       menuType: [0],
          //       data: {
          //         menu: {
          //           title: "Stock Ledger Report"
          //         }
          //       }
          //     },
          //     {
          //       path: "stockvaluation-reportdms",
          //       menuType: [0],
          //       data: {
          //         menu: {
          //           title: "Stock Valuation Report"
          //         }
          //       }
          //     },
          //     {
          //       path: "stockabc-analysis-reportdms",
          //       menuType: [0],
          //       data: {
          //         menu: {
          //           title: "Stock ABC Analysis Report"
          //         }
          //       }
          //     },
          //     {
          //       path: "currentstock-warehousewise-reportdms",
          //       menuType: [0],
          //       data: {
          //         menu: {
          //           title: "Stock Report - Warehouse Wise"
          //         }
          //       }
          //     },
          //   ]
          // },
                  


          // {
          //   path: "openingbalance",
          //   data: {
          //     menu: {
          //       title: "Opening Balance",
          //       selected: false,
          //       expanded: false
          //     }
          //   }
          // },
          // {
          //   path: "accountpayablereport",
          //   data: {
          //     menu: {
          //       title: "Account Payable Report",
          //       selected: false,
          //       expanded: false
          //     }
          //   }
          // },
          // {
          //   path: "accountreceivablereport",
          //   data: {
          //     menu: {
          //       title: "Account Receivable Report",
          //       selected: false,
          //       expanded: false
          //     }
          //   }
          // }
          // {
          //   path: "vatsalesreport",
          //   data: {
          //     menu: {
          //       title: "VAT Sales Report",
          //       selected: false,
          //       expanded: false
          //     }
          //   },
          //   children: [
          //     {
          //       path: "abbreviated-sales-report",
          //       menuType: [],
          //       data: {
          //         menu: {
          //           title: "Abbreviated Sales Report ",
          //           selected: false,
          //           expanded: false
          //         }
          //       }
          //     },






          //   ]
          // },
        ]
      },

      {
        path: "configuration",
        menuType: [0],
        data: {
          menu: {
            title: "Configuration",
            icon: "ion-gear-b",
            selected: false,
            expanded: false,
            order: 2
          }
        },
        children: [
          {
            path: "userManager",
            menuType: [0],
            data: {
              menu: {
                title: "User Manager",
                icon: "ion-android-people",
                selected: false,
                expanded: false,
                order: 90
              }
            },
            children: [
              {
                path: "userlist",
                menuType: [0],
                data: {
                  menu: {
                    title: "User List"
                  }
                }
              }
            ]
          },
          // {
          //   path: "settings",
          //   menuType: [0],
          //   data: {
          //     menu: {
          //       title: "Settings",
          //       icon: "",
          //       selected: false,
          //       expanded: false,
          //       order: 90
          //     }
          //   },
           
          // },
          // {

          //     path:"manual-sync",
          //     menuType:[0],
          //     data:{
          //       menu:{
          //         title:"Manual Sync",
          //         selected:false,
          //         expanded: false
          //       }
          //     }

          // },
          // {
          //   path: "master-migration",
          //   menuType: [0],
          //   data: {
          //     menu: {
          //       title: "Master Migration"
          //     }
          //   }
          // },


        ]
      },


    ]
  }
];
