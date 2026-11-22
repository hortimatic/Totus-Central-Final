import {discoverWorkstations} from './workstation-discovery.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {localOrderLookupInput} from './local-adapter.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {chooseNativeCustomer} from './native-customer-picker.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {createCreditCollections} from './credit-collections.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {openCentralCheckoutDialog,confirmCentralOperator} from './central-checkout-dialog.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {createOrderNoticeWatcher,orderNoticeInbox,orderNoticeOptions,orderNoticeFields,orderNoticeFromForm,orderNoticePolicy} from './order-notices.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {createOwnedTpvSetup} from './owned-configuration.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {createCheckoutRulesPanel,CHECKOUT_DEFAULTS,checkoutRules,checkoutReceived} from './checkout-rules.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {createCashSetup} from './cash-setup.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {createPromotionPanel} from './promotions.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {createLoyaltyPanel} from './loyalty.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {createReceiptSetup} from './receipt-setup.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {createGeneralSetup} from './general-setup.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {taxPreference,taxPreferenceHtml,createTaxGroupPicker} from './catalogue-tax.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {barcodeOptions,barcodeOptionsHtml,barcodeOptionsFromForm} from './barcode-options.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {createTicketBranding} from './ticket-branding.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {workstationHeader,workstationDialog,workstationIcon} from './workstation-visual.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {referencePolicyPayload,confirmReferencePolicy} from './reference-policy-settings.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {applyReferencePreferences,normalizeReferencePreferences} from './reference-preferences.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {referenceSettingsHtml,referenceActionsHtml,folderIcon,productIcon} from './reference-interface.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {customerSettings} from './customer-settings.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {createInventoryPanel} from './inventory-panel.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {customerOptionsHtml,customerSettingsFormValues,customerSettingsFromForm,customerSettingsError,changeCustomerFieldPosition} from './customer-options.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {budgetOptions,budgetOptionsFromForm,budgetOptionsHtml,budgetSettingsError} from './budget-options.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {operatorSwitchPolicy,operatorSwitchPolicyHtml,saveOperatorSwitchPolicy} from './operator-switch-policy.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {sensitiveSettings,sensitiveSettingsHtml,createPasswordPrompt} from './sensitive-actions.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {loadGiftReceipt} from './gift-discounts.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {operatorSettings,operatorSettingsHtml} from './operator-settings.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {operatorAvailability,createOperatorPicker} from './operator-picker.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {cashVisibility,cashVisibilityHtml} from './cash-visibility.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {createAccessBatchPanel} from './workstation-access-batch.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {createSignaturePanel} from './signature-panel.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {signatureOptions,signatureOptionsFromForm,signatureOptionsHtml} from './signature-options.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {tenderSummaryHtml} from './tender-summary.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {returnPolicy,returnPolicyHtml} from './return-policy.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {menuLinks as normalizeMenuLinks,menuLinksFromForm,menuLinksHtml,menuLinksActions} from './menu-links.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {createCatalogueBackground} from './catalogue-background.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {mountSettingsNavigation} from './settings-navigation.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {roundPriceMicros,roundPriceSubtotal} from './offline-rounding.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {createOfflineSync} from './offline-sync.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {createOfflineJournal} from './offline-journal.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {offlineDevice} from './offline-device.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {submitWithLocalReceipt} from './local-sale-submission.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {createOfflinePanel} from './offline-panel.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {lineName,createLineNameEditor} from './line-name.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {budgetDocumentHtml,budgetStatus} from './budget-document.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {saleNote} from './sale-note.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {paymentFormMethods,paymentSettingsHtml,paymentSettingsFromForm} from './payment-options.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {paymentReferenceFields,referenceForTender} from './payment-reference.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {parkingOptions,parkingOptionsHtml,parkingOptionsFromForm,parkingExpiry} from './parking-options.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {lineOptions,lineOptionsHtml,lineOptionsFromForm,lineAdjustment} from './line-options.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {stockPolicy,stockPolicyFromForm,stockPolicyHtml,canExceedStock,canSellProduct,stockWarning} from './stock-policy.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {createQuantityPicker} from './quantity-picker.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {createTpvPracticeAdapter} from './practice-adapter.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {cashTenderPreview} from './model.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {taxSummaryHtml} from './tax-summary.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {receiptHtml as nativeReceiptHtml,receiptPreviewHtml,giftReceiptPreviewHtml,downloadNativePdf,printReceipt,printTpvMarkup} from './documents.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {receiptSeries,receiptSeriesFromForm,receiptSeriesHtml,receiptSeriesError,receiptNumber} from './receipt-series.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {receiptOptions,receiptOptionsHtml,receiptOptionsFromForm} from './receipt-options.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {createReceiptDelivery} from './receipt-delivery.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {orderLookupInput} from './central-adapter.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {createTpvCustomerPanel} from './customers.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {createCashReportsPanel} from './cash-reports.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {createStockIntake} from './stock-intake.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {createBarcodePanel} from './barcode-panel.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {createProductIntakePanel} from './product-intake.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {cashOptions,cashOptionsHtml,cashOptionsFromForm,cashCountHtml,updateCashCount,clearCashCount,mountCashOptions} from './cash-counting.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {createWorkstationAccessPanel} from './workstation-access.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {createCustomerDisplay,customerDisplayOptions,customerDisplayOptionsHtml,customerDisplayOptionsFromForm} from './customer-display.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {createCatalogueTable,priceBuildHtml} from './catalogue-table.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {displayPreferences,displayPreferencesHtml,displayPreferencesFromForm,cataloguePriceCents,variantOrder,TPV_VARIANT_ORDERS} from './display-preferences.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {searchPreferences,searchPreferencesFromForm,searchPreferencesHtml,TPV_SEARCH_FIELDS} from './search-preferences.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
import {cataloguePreferences,cataloguePreferencesFromForm,cataloguePreferencesHtml,visibleCatalogueCategories,catalogueDetails,variantDetails} from './catalogue-preferences.js?v=944bfb74ef1c3bf969f35cf4843a5397640828ca';
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=value=>new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(value/100);
export function inputCents(value) {
 const match=String(value).trim().match(/^(0|[1-9][0-9]{0,6})(?:[,.]([0-9]{1,2}))?$/);
 if(!match)throw new Error('Escribe un importe válido, con un máximo de dos decimales.');
 return Number(match[1])*100+Number((match[2]||'').padEnd(2,'0'));
}
const button=(action,label,kind='secondary',disabled=false)=>`<button type="button" class="btn ${kind}" data-tpv-action="${action}" ${disabled?'disabled':''}>${label}</button>`;
const paymentLabel=method=>({cash:'Efectivo',card:'Tarjeta',bizum:'Bizum',transfer:'Transferencia',cheque:'Cheque',mixed:'Mixta'}[method]||method);

/** Shared Central workspace. Practice is deliberately explicit and isolated.
 * No code in this browser module can import the privileged checkout adapters.
 */
export function createTpvWorkspace({actor,can,storage,confirm=async()=>false,
 confirmPassword=null,prepareOperatorLogin=null,onConfigure=null,canConfigure=()=>false,onAppearance=null,canAppearance=()=>false,onChangeOperator=null,readOperatorChoices=null,onOnlineOrders=null,canOnlineOrders=()=>false,onBilling=null,canBilling=()=>false,onCash=null,canCentralCash=()=>false,readSetup=null,createLiveAdapter=null,
 readConfiguration=null,generalSetupInvoke=null,storeBrandingSetup=null,storeReceiptSeriesSetup=null,storeLoyaltySetup=null,storePromotionSetup=null,storeCheckoutRules=null,storeCommercialSetup=null,storeSensitiveSetup=null,storeOrderNotices=null,orderNoticeCheckpoint=null,orderPrintCommand=null,configureWorkstation=null,cashVisibilityStore=null,operatorSettingsStore=null,drawerManagement=()=>null,workspacePreferences=null,ticketBrandingStore=null,receiptNumbering=null,budgetSettingsStore=null,customerSettingsStore=null,menuLinksStore=null,returnPolicyStore=null,canReturnPolicy=()=>false,signaturePolicyStore=null,canSignatureSettings=()=>false,canAssign=()=>false,canCustomer=()=>false,canStock=()=>false,applyInventory=null,catalogueTaxChange=null,canEditProductTax=()=>false,canCreateProduct=()=>false,canReadCost=()=>false,autoOpen=false,referencePreview=false}={}) {
 let centralSettingsDrawerId='';
 let checkoutStyle={...CHECKOUT_DEFAULTS};
 const nativeCheckout=createCheckoutRulesPanel({store:(...args)=>storeCheckoutRules(...args)});
 const nativePromotion=createPromotionPanel({store:(...args)=>storePromotionSetup(...args)});
 const nativeLoyalty=createLoyaltyPanel({store:(...args)=>storeLoyaltySetup(...args)});
 const cashSetup=createCashSetup({actor,canConfigure:canAssign,initialDrawer:()=>centralSettingsDrawerId||session?.drawerId||selectedDrawer,onDrawer:id=>{centralSettingsDrawerId=id;},invoke:(name,args)=>generalSetupInvoke(name,args),drawerManagement,confirm,onClose:()=>render()});
 const permissionsSetup=createCashSetup({accessOnly:true,storeSensitiveSetup,actor,canConfigure:canAssign,initialDrawer:()=>centralSettingsDrawerId||session?.drawerId||selectedDrawer,onDrawer:id=>{centralSettingsDrawerId=id;},invoke:(name,args)=>generalSetupInvoke(name,args),drawerManagement,confirm,onClose:()=>render()});
 const paymentSetup=createCashSetup({paymentOnly:true,storeCheckoutRules,storeCommercialSetup,actor,canConfigure:canAssign,initialDrawer:()=>centralSettingsDrawerId||session?.drawerId||selectedDrawer,onDrawer:id=>{centralSettingsDrawerId=id;},invoke:(name,args)=>generalSetupInvoke(name,args),drawerManagement,confirm,onClose:()=>render()});
 const generalSetup=createGeneralSetup({actor,canConfigure:canAssign,initialDrawer:()=>centralSettingsDrawerId||session?.drawerId||selectedDrawer,onDrawer:id=>{centralSettingsDrawerId=id;},invoke:(name,args)=>generalSetupInvoke(name,args),confirm,onClose:()=>render()});
 const receiptSetup=createReceiptSetup({actor,storage,canConfigure:canAssign,initialDrawer:()=>centralSettingsDrawerId||session?.drawerId||selectedDrawer,onDrawer:id=>{centralSettingsDrawerId=id;},invoke:(name,args)=>generalSetupInvoke(name,args),storeBranding:(scope,value)=>storeBrandingSetup(scope,value),storeSeries:storeReceiptSeriesSetup,storeLoyalty:storeLoyaltySetup,storePromotion:storePromotionSetup,confirm,onClose:()=>render()});
 const ownedSetups=Object.fromEntries(['special','returns','barcodes','budgets'].map(key=>[key,createOwnedTpvSetup(key,{actor,canConfigure:canAssign,initialDrawer:()=>centralSettingsDrawerId||session?.drawerId||selectedDrawer,onDrawer:id=>{centralSettingsDrawerId=id;},invoke:(name,args)=>generalSetupInvoke(name,args),confirm,onClose:()=>render()})]));
 let budgetRules=budgetOptions(),customerRules=customerSettings(),referenceSection='General',quickPaymentMethod='cash';
 let operatorAuthRules=operatorSwitchPolicy();
 let sensitiveRules=sensitiveSettings();const passwordPrompt=createPasswordPrompt();
 let operatorRules={switchEnabled:true,revision:0,requireAtCheckout:false};
 let cashVisibilityRules={hideSummary:false};
 let categories=[],categoryId=0,initialCategoryId=0,catalogueView='grid',incidentForm=false;
 let settingsDrawerId='',settingsAdapter=null,saleCatalogueBeforeSettings=null;
 let includeDisabledStock=false,workstationOpen=false,workstationStore='',workstationDrawer='';
 let scanQueue=[],scanning=false,mobilePane='catalogue';
 let catalogueSort={field:'name',direction:'asc'},catalogueRefreshTimer=null;
 let variantGroupId=0,variantProductName='',variantView='',parentCatalogueSort=null;
 let displayOptions=displayPreferences(),audioFeedback=null,searchOptions=searchPreferences(),catalogueOptions=cataloguePreferences();
 let stockRules=stockPolicy(),priceRules=lineOptions(),parkingRules=parkingOptions(),taxRules=taxPreference();const taxGroupPicker=createTaxGroupPicker();
 let budgetPage={items:[],hasMore:false},selectedBudget=null,budgetEditing=false,budgetQuery='',budgetPending=false;
 const quantityPicker=createQuantityPicker(),lineNameEditor=createLineNameEditor();
 let receiptStyle=receiptOptions(),numbering=null;
 let cashStyle=cashOptions();
 let barcodeRules=null,orderNotices=orderNoticeOptions(),orderNoticeRevision=0;
 let drawerPayments=null,customMenuLinks=[],returnRules={allowPartial:true},signatureRules=signatureOptions();
 let customerScreenOptions=customerDisplayOptions();
 let orderLookup='',focusOrderLookup=false,webHistory=false;
 let host=null,adapter=null,context=null,session=null,products=[],lines=[],search='',tab='sale',notice='',failure='',
  busy=false,payment=null,receipt=null,history=[],summary=null,generation=0,searchTimer=null,abort=null,
  returnForm=null,paymentValues={},formValues={},formDirty=false,selectedStore='',selectedDrawer='',searchRevision=0,setup=null,
  productPage=0,variantProduct=0,stockProduct=null,configuration=null,configurationId=null,documentPreview=null,selectedCustomer=null,parked=[],draftInfo=null;
 const central=()=>adapter?.mode==='central';
 const live=()=>adapter?.mode==='qa';
 let catalogueStatus={phase:'idle'};
 function catalogueStatusText(){const state=catalogueStatus;if(globalThis.navigator?.onLine===false)return 'Sin conexión · consulta el catálogo guardado.';if(state.phase==='preparing')return state.products?`Guardando catálogo · ${state.completedProducts} de ${state.products} productos`:'Preparando catálogo guardado…';if(state.phase==='updated')return 'Catálogo guardado actualizado';if(state.phase==='retry')return 'No se pudo actualizar el catálogo guardado. Volveremos a intentarlo automáticamente.';return 'Catálogo guardado pendiente de actualizar';}
 const catalogueBackground=createCatalogueBackground({onState:state=>{catalogueStatus=state;const node=host?.querySelector('[data-tpv-catalogue-status]');if(node)node.textContent=catalogueStatusText();},current:()=>host&&allowed()&&mountedActor===identity()&&live()&&session&&adapter.prepareOfflineCatalogue?{key:JSON.stringify([generation,identity(),session.id,session.storeId,session.drawerId,selectedCustomer]),prepare:options=>adapter.prepareOfflineCatalogue(options)}:null,canRun:()=>!busy&&!payment&&!returnForm&&globalThis.navigator?.onLine!==false});
 const offlinePanel=createOfflinePanel({storage,getActionApproval:({kind,operationId,totalCents})=>confirmSensitive(kind,operationId,totalCents),getOperatorAcknowledgement:confirmPendingOperator,getAdapter:()=>adapter,isCurrent:()=>!!host&&allowed()&&mountedActor===identity()&&live(),getScope:()=>{const drawer=context?.drawers.find(row=>row.id===session?.drawerId);return {actorId:identity(),connectionId:drawer?.connectionId,storeId:session?.storeId,shopId:drawer?.shopId,drawerId:session?.drawerId,cashSessionId:session?.id};}});
 const signaturePanel=createSignaturePanel({actor:()=>identity(),storage:storage||{getItem:key=>globalThis.localStorage.getItem(key),setItem:(key,value)=>globalThis.localStorage.setItem(key,value),removeItem:key=>globalThis.localStorage.removeItem(key)},getAdapter:()=>adapter,getSettings:()=>signatureRules,canWrite:()=>live()&&!!session&&canSell(),getScope:()=>{const drawer=context?.drawers.find(row=>row.id===(session?.drawerId||selectedDrawer));return {connectionId:drawer?.connectionId,shopId:drawer?.shopId,drawerId:drawer?.id,sessionId:session?.id};}});
 function stationPermission(key){if(!live()&&!central())return true;const drawer=context?.drawers.find(row=>row.id===(session?.drawerId||selectedDrawer||context.drawers[0]?.id));return !!drawer&&drawer[key]===true;}
 const canSell=()=>can('create')&&stationPermission('canSell'),canManageCash=()=>can('create')&&stationPermission('canOpen'),
  canReceiveStock=()=>canStock()&&stationPermission('canSell');
 const receiptDelivery=createReceiptDelivery({getDocument:args=>adapter.document(args),print:printReceipt});
 const reports=createCashReportsPanel({adapter:()=>adapter,getLogo:()=>ticketBranding.savedLogo(),canOpenCentral:()=>live()&&!!onCash&&canCentralCash(),capturePrintContext:()=>{const run=generation,operator=identity();return()=>run===generation&&operator===identity()&&allowed();}});
 const stockIntake=createStockIntake({adapter:()=>adapter,canEdit:canReceiveStock});
 const canInventory=()=>!live()?can('view'):canStock()&&stationPermission('canReconcile');
 const ticketBranding=createTicketBranding({actor:identity,storage:{getItem:key=>(storage||globalThis.localStorage).getItem(key),setItem:(key,value)=>(storage||globalThis.localStorage).setItem(key,value)},store:ticketBrandingStore,canEdit:()=>live()?canAssign():can('edit')});
 const inventoryPanel=createInventoryPanel({storage:{getItem:key=>(storage||globalThis.localStorage).getItem(key),setItem:(key,value)=>(storage||globalThis.localStorage).setItem(key,value)},actor:identity,can:canInventory,canApply:()=>live()&&canInventory()&&!!applyInventory});
 const barcodePanel=createBarcodePanel({adapter:()=>adapter,canRead:()=>live()&&canReadCost()&&stationPermission('canReconcile'),canEdit:()=>live()&&canStock(),onProgress:()=>render(),confirm:message=>askCurrent(message,{acceptLabel:'Cancelar trabajo'})});
 function noticeDrawer(){return context?.drawers.find(row=>row.id===(session?.drawerId||selectedDrawer));}
 const orderWatch=createOrderNoticeWatcher({
  scope:()=>{const drawer=noticeDrawer();return {actorId:identity(),connectionId:drawer?.connectionId,shopId:drawer?.shopId,drawerId:drawer?.id};},
  settings:()=>orderNotices,current:()=>!!host&&allowed()&&mountedActor===identity()&&live()&&!settingsDrawerId&&canOnlineOrders()&&typeof adapter?.webOrders==='function',
  storage:{getItem:key=>(storage||globalThis.localStorage).getItem(key),setItem:(key,value)=>(storage||globalThis.localStorage).setItem(key,value)},
  readOptions:async()=>{const drawer=noticeDrawer();return orderNoticePolicy(await storeOrderNotices(drawer),drawer.id).settings;},
  readCheckpoint:(high,orders)=>{if(!orderNoticeCheckpoint)throw Error('No se han podido recuperar los avisos compartidos de Central.');return orderNoticeCheckpoint(noticeDrawer(),high,orders);},
  readOrders:()=>adapter.webOrders({}),readOwnOrders:async()=>(await adapter.orders()).filter(row=>row.status==='confirmed'&&Number.isSafeInteger(row.orderId)),
  readReceipt:id=>adapter.webReceipt(id),reservePrint:request=>{if(!orderPrintCommand)throw Error('No se ha podido coordinar la impresión con Central.');return orderPrintCommand(noticeDrawer(),request);},
  print:(document,current)=>{if(!receiptStyle.showOnlineTickets)throw Error('Activa el ticket de pedidos online en Ticket antes de imprimir.');return printReceipt(document,effectiveReceiptStyle(),{current});},
  onChange:()=>{if(host&&!busy&&tab==='order-notices')render();else{const node=host?.querySelector('[data-tpv-new-orders-status]');if(node)node.innerHTML=orderNoticeBanner();}}
 });
 function orderNoticeBanner(){const snapshot=orderWatch.snapshot(),pending=snapshot.jobs.filter(row=>row.status!=='requested').length;
  return live()&&(pending||snapshot.message)?'<div class="tpv-online-notice"><span>'+esc(pending?pending+' pedidos con impresión pendiente o por revisar':snapshot.message)+'</span>'+button('order-notices','Ver pedidos nuevos')+'</div>':'';
 }
 function nativeOrderNoticeForm(){if(!live()||!storeOrderNotices)return '';const draft=formValues['order-notices'];
  const value=draft?{enabled:draft.enabled==='on',autoPrint:draft.autoPrint==='on'}:orderNotices;
  return '<form data-tpv-form="order-notices" class="tpv-settings-card">'+orderNoticeFields(value,{disabled:!canAssign()})+(canAssign()?'<button type="submit" class="btn primary">Guardar avisos e impresión</button>':'')+'</form>';
 }
 const productIntake=createProductIntakePanel({adapter:()=>adapter,canCreate:()=>live()&&!!session&&canSell()&&canCreateProduct()&&!payment&&!returnForm&&receipt?.status!=='uncertain',
  canRead:()=>live()&&(canReadCost()||canCreateProduct())&&stationPermission('canReconcile'),
  confirmDiscard:message=>askCurrent(message,{acceptLabel:'Continuar'}),onProgress:()=>render()});
 const catalogueTable=createCatalogueTable({canReadCost});
 const operatorPicker=createOperatorPicker();
 const accessBatch=createAccessBatchPanel({actor:()=>identity(),canManage:canAssign,invoke:request=>configureWorkstation(request),storage});
 const accessPanel=createWorkstationAccessPanel({canManage:canAssign,invoke:request=>configureWorkstation(request)});
 const customerScreen=createCustomerDisplay({getOptions:()=>customerScreenOptions,
  allowed:()=>!!host&&mountedActor===identity()&&allowed()&&!!adapter&&!!context&&!!session,
  canShowCustomer:()=>canCustomer('view')===true,getState:()=>{
   const phase=returnForm?'idle':receipt?.status==='confirmed'?'confirmed':receipt?.status==='uncertain'?'uncertain':payment?'verified':lines.length?'estimate':'idle';
   return {storeName:context?.stores.find(s=>s.id===(session?.storeId||selectedStore))?.name,environment:live()?'qa':'practice',phase,customerName:selectedCustomer?.name,discountCents:payment?.discountCents,
    totalCents:receipt?.totalCents??payment?.totalCents??previewTotal(),
    lines:shownLines().map(l=>({name:l.name,quantity:l.qty,cents:previewLine(l)}))};
  }});
 const wording=(practice,actual)=>live()||central()?actual:practice;
 const customers=createTpvCustomerPanel({adapter:()=>adapter,settings:()=>customerRules,can:action=>canCustomer(action)&&(action==='view'||canSell()),onSelect:async value=>{selectedCustomer=value;notice='';for(const line of lines)line.pricePending=true;await reloadProducts();void refreshBasketPrices();},
  onStatus:value=>notice=value,confirmDiscard:()=>askCurrent('¿Descartar los cambios de esta ficha?',{acceptLabel:'Descartar cambios'})});
 function allowed(){return actor()?.active!==false&&!!actor()?.id&&can('view');}
 function identity(){return `${actor()?.id||''}`;}
 let mountedActor='',onlineSyncRequested=false,onlineSyncTimer=null;
 function bindAdapter(raw){const born=generation;
  return Object.fromEntries(Object.entries(raw).map(([key,value])=>[key,typeof value!=='function'?value:
   async(...args)=>{if(born!==generation)throw new Error('La vista ha cambiado.');guard();
    const result=await value(...args);if(born!==generation)throw new Error('La vista ha cambiado.');guard();return result;}]));}
 function bindPractice(){checkoutStyle={...CHECKOUT_DEFAULTS};taxRules=taxPreference();try{const saved=JSON.parse((storage||globalThis.localStorage).getItem('totus:tpv:reference-preferences:'+identity())||'null');if(saved){const value=normalizeReferencePreferences(saved);catalogueView=value.viewMode;initialCategoryId=value.initialCategoryId;displayOptions=value.display;receiptStyle=value.receipt;customerScreenOptions=value.customerDisplay;searchOptions=value.search;catalogueOptions=value.catalogue;includeDisabledStock=value.search.includeDisabledStock;}}catch{}operatorRules={switchEnabled:true,revision:0,requireAtCheckout:false};let practiceStorage=storage;
  try{practiceStorage??=globalThis.localStorage;}catch{throw new Error('Este navegador no permite guardar la práctica. Revisa sus permisos de almacenamiento.');}
  return bindAdapter(createTpvPracticeAdapter({actorId:identity(),storage:practiceStorage,referenceCatalogue:true}));}
 const guard=()=>{if(!host||!allowed()||mountedActor!==identity())throw new Error('La sesión ha cambiado. Vuelve a entrar en TotusTPV.');};
 let creditScope=null;
 const creditCollections=createCreditCollections({adapter:()=>adapter,isCurrent:()=>!!host&&allowed()&&central()&&canCustomer('view')&&creditScope?.generation===generation&&creditScope?.owner===identity()&&creditScope?.drawer===(session?.drawerId||selectedDrawer),canCollect:()=>!!session&&canSell()});
 async function confirmSensitive(kind,operationId,totalCents){
  if(!live()||!adapter.actionPolicy)return undefined;
  const run=generation,owner=identity(),drawerId=session?.drawerId,cashSessionId=session?.id;
  const current=()=>run===generation&&owner===identity()&&!!host&&allowed()&&session?.drawerId===drawerId&&session?.id===cashSessionId;
  sensitiveRules=sensitiveSettings(await adapter.actionPolicy());if(!current())return false;
  if(!(kind==='refund'?sensitiveRules.requireRefund:sensitiveRules.requirePrice))return undefined;
  if(!confirmPassword||!adapter.approveAction)throw Error('No se puede confirmar tu cuenta desde este puesto. El ticket se conserva.');
  const result=await passwordPrompt.request({account:actor()?.full_name||actor()?.email||'Mi cuenta',purpose:(kind==='refund'?'esta devolución':'este precio modificado')+(Number.isSafeInteger(totalCents)?' · '+money(totalCents):''),isCurrent:current,
   confirm:password=>confirmPassword({password,approve:proofJwt=>{if(!current())throw Error('La sesión ha cambiado.');return adapter.approveAction({requestId:crypto.randomUUID(),targetId:operationId,kind,proofJwt});}})});
  if(!current()||!result)return false;
  if(result.operationId!==operationId||result.kind!==kind||typeof result.approvalId!=='string'||!Number.isSafeInteger(result.expiresAt)||result.expiresAt<=Date.now())throw Error('La confirmación ha caducado. Vuelve a confirmar tu cuenta.');
  return result.approvalId;
 }
 async function verifyOperatorHandoff(target){
  if((!live()&&!central())||!adapter.verifyOperatorSwitch)return target;
  const run=generation,owner=identity(),drawerId=session?.drawerId||selectedDrawer,requestId=crypto.randomUUID(),targetId=target?.operatorId??null;
  const current=()=>run===generation&&owner===identity()&&!!host&&allowed()&&(session?.drawerId||selectedDrawer)===drawerId;
  operatorAuthRules=operatorSwitchPolicy(await adapter.operatorSwitchPolicy());if(!current())return false;
  const verify=proofJwt=>{if(!current())throw Error('La sesión ha cambiado.');return adapter.verifyOperatorSwitch({requestId,targetId,...(proofJwt?{proofJwt}:{})});};
  let result,transfer;
  if(operatorAuthRules.requireBeforeSwitch&&targetId){
   if(!prepareOperatorLogin)throw Error('No se puede iniciar la cuenta seleccionada desde este puesto. Tu sesión sigue abierta.');
   transfer=await passwordPrompt.request({account:target.name||target.loginEmail,purpose:'el acceso del operador',description:'Introduce la contraseña de la cuenta seleccionada. Cancelar mantiene tu sesión abierta.',isCurrent:current,disposeResult:value=>value?.cancel(),confirm:password=>prepareOperatorLogin({target,password,verify,isCurrent:current})});
   if(!transfer)return false;
   result=transfer.verification;
  }else result=await verify();
  if(!result||!current()){await transfer?.cancel();return false;}
  if(result.verified!==true||result.requestId!==requestId||result.actorId!==owner||result.drawerId!==drawerId||typeof result.requiresPassword!=='boolean'||!Number.isSafeInteger(result.policyRevision)||result.policyRevision<0||((result.target?.operatorId??null)!==targetId)){await transfer?.cancel();throw Error('No se ha podido comprobar el cambio de operador. Tu sesión sigue abierta.');}
  operatorAuthRules={requireBeforeSwitch:result.requiresPassword,revision:result.policyRevision};
  if(transfer){try{await transfer.adopt();}finally{await transfer.cancel();}return false;}
  return result.target??{loginEmail:'',name:''};
 }
 function workspaceMenuHtml(){return `<details class="tpv-actions"><summary>${central()?'Menú del TPV':'Más acciones'}</summary><div>${central()?`${button('sale','Mostrador')}   <button type="button" class="tab ${['reference-actions','stock','inventory','credits'].includes(tab)?'active':''}" data-tpv-action="reference-actions">Gestión diaria</button>
   <button type="button" class="tab ${tab==='history'?'active':''}" data-tpv-action="history">${wording('Tickets de práctica','Pedidos y devoluciones')}</button>
   <button type="button" class="tab ${tab==='session'?'active':''}" data-tpv-action="session">Caja</button><button type="button" class="tab ${tab==='settings'?'active':''}" data-tpv-action="settings">Configuración</button>`:''}${button('fullscreen','Pantalla completa')}${live()?`${button('reports','Informes de caja')}${button('drafts','Tickets aparcados')}${button('budgets','Presupuestos')}${canReadCost()?button('product-history','Altas de productos'):''}${canReadCost()?button('barcodes','Códigos de barras'):''}${session?button('offline-pending','Ventas pendientes de sincronizar'):''}${storeOrderNotices?button('order-notices','Pedidos nuevos e impresión'):''}${customerScreenOptions.enabled&&session?button('customer-display','Pantalla para cliente'):''}`:''}${onOnlineOrders&&canOnlineOrders()?button('online-orders','Pedidos online'):''}${onChangeOperator&&operatorRules.switchEnabled?button('change-operator','Cambiar operador'):''}${button('exit','Salir del puesto')}${live()||central()?menuLinksActions(customMenuLinks):''}</div></details>`;}
 function contextBar(){const storeId=session?.storeId||selectedStore||context.stores[0]?.id,drawerId=session?.drawerId||selectedDrawer||context.drawers.find(row=>row.storeId===storeId)?.id;return workstationHeader({stores:context.stores,drawers:context.drawers,storeId,drawerId,userName:actor()?.full_name||'Usuario de Central',open:!!session})+`<div class="tpv-context-fields" hidden><select data-tpv-store ${session?'disabled':''}>${context.stores.map(row=>`<option value="${esc(row.id)}" ${row.id===storeId?'selected':''}>${esc(row.name)}</option>`).join('')}</select><select data-tpv-drawer ${session?'disabled':''}>${context.drawers.filter(row=>row.storeId===storeId).map(row=>`<option value="${esc(row.id)}" ${row.id===drawerId?'selected':''}>${esc(row.name)}</option>`).join('')}</select></div>`;}
 function render() {
  if(generalSetup.isOpen()||receiptSetup.isOpen()||(cashSetup.isOpen()||paymentSetup.isOpen()||permissionsSetup.isOpen()||Object.values(ownedSetups).some(panel=>panel.isOpen())))return;
  catalogueBackground.update();
  if(!host)return;
  productIntake.capture(host);
  if(!allowed()||mountedActor!==identity()){const root=host;dispose();root.innerHTML='<p role="alert">La sesión ha cambiado. Vuelve a entrar en TotusTPV.</p>';return;}
  if(!settingsDrawerId)customerScreen.sync();
  host.classList.toggle('tpv-active',!!adapter&&!!context);sizeWorkspace();
  const settingsScroll=tab==='settings'&&host.querySelector('.tpv-settings')?host.querySelector('[data-tpv-body]')?.scrollTop:null;
  const scanningInput=scanning?host.querySelector('[data-tpv-search]'):null,
   scanInputState=scanningInput?{value:scanningInput.value,start:scanningInput.selectionStart,end:scanningInput.selectionEnd,focused:document.activeElement===scanningInput}:null;
  if(!adapter||!context){host.innerHTML=`<section class="tpv-activation" aria-busy="${busy}">
   <header class="tpv-entry-heading"><div><span class="tpv-entry-eyebrow">TU PUESTO DE VENTA</span><h3>${busy?'Abriendo tu caja…':'Abrir mostrador'}</h3></div><div class="tpv-entry-account"><small>Usuario</small><strong>${esc(actor()?.full_name||'Tu cuenta de Central')}</strong>${onChangeOperator&&operatorRules.switchEnabled&&!busy?button('change-operator','Cambiar'):''}</div></header>
   ${failure?`<p class="note bad" role="alert">${esc(failure)}</p>`:notice?`<p class="note" role="status">${esc(notice)}</p>`:''}
   ${!busy?`<div class="tpv-entry-primary"><span class="tpv-entry-symbol" aria-hidden="true">${workstationIcon('drawer')}</span><div><h4>Tu tienda y tu caja</h4><p>Selecciona tu puesto o recupera la caja que dejaste abierta.</p></div>${createLiveAdapter?button('live',failure?'Volver a intentar':'Seleccionar puesto','primary'):''}</div>
`:'<p class="tpv-entry-loading" role="status">Consultando tus cajas disponibles…</p>'}
   ${!busy&&canAssign()?`<section class="tpv-entry-administration"><h4>Preparar el TPV</h4><div class="tpv-entry-admin-grid">${generalSetupInvoke?button('entry-settings','Configuración del TPV','secondary'):''}${drawerManagement?.()?`<a class="btn secondary" href="${esc(drawerManagement())}">Gestionar tiendas y cajas</a>`:readConfiguration?button('assign','Gestionar tiendas y cajas','secondary'):''}${readSetup?button('setup','Comprobar conexión','secondary'):''}</div>${setup?setupHtml():''}${!generalSetupInvoke&&configuration?configurationHtml():''}</section>`:''}
   </section>`;host.querySelectorAll('label').forEach(el=>el.classList.add('field'));return;}
  const status=failure?`<p class="note bad" role="alert">${esc(failure)}</p>`:notice&&!notice.startsWith('Historial:')?`<p class="note" role="status">${esc(notice)}</p>`:'';
  host.innerHTML=`<header class="tpv-workspace-bar">${contextBar()}${central()?`<div class="tpv-header-actions">${button('exit','Inicio TPV')}${workspaceMenuHtml()}</div>`:''}<span class="tpv-environment" title="${central()?'Catálogo, ventas y cajas de Central.':wording('Artículos y cobros ficticios. No se modifica la tienda.','Los cobros crean pedidos y modifican stock en la web de pruebas.')}">${central()?'Central':wording('Práctica','Tienda de pruebas')}</span>${button('fullscreen','Pantalla completa')}</header>
   <nav class="module-tabs tpv-main-nav" aria-label="TotusTPV" ${central()&&(tab!=='sale'||!session)?'hidden':''}>${tab==='sale'&&session&&!payment?`<label class="tpv-nav-search"><span aria-hidden="true">⌕</span><input type="search" inputmode="${searchOptions.numericKeyboard?'numeric':'search'}" data-tpv-search placeholder="Nombre / Referencia" aria-label="Buscar artículo" title="${esc(searchOptions.fields.map(key=>TPV_SEARCH_FIELDS[key]).join(', '))}" value="${esc(search)}" autocomplete="off"></label>`:''}${central()?'':`<button type="button" class="tab ${tab==='sale'?'active':''}" data-tpv-action="sale">Venta</button>`}
   ${central()?'':`   <button type="button" class="tab ${['reference-actions','stock','inventory','credits'].includes(tab)?'active':''}" data-tpv-action="reference-actions">Gestión diaria</button>
   <button type="button" class="tab ${tab==='history'?'active':''}" data-tpv-action="history">${wording('Tickets de práctica','Pedidos y devoluciones')}</button>
   <button type="button" class="tab ${tab==='session'?'active':''}" data-tpv-action="session">Caja</button><button type="button" class="tab ${tab==='settings'?'active':''}" data-tpv-action="settings">Configuración</button>`}${central()?'':workspaceMenuHtml()}</nav><div class="tpv-workarea">${status}${live()&&!canSell()?'<p class="note" role="status">'+(canManageCash()?'Puedes consultar y gestionar la caja. Tu acceso no permite registrar ventas.':'Acceso de consulta. No puedes registrar ventas ni movimientos de efectivo.')+'</p>':''}
   ${live()&&session&&adapter.prepareOfflineCatalogue?`<p class="small muted" data-tpv-catalogue-status>${esc(catalogueStatusText())}</p>`:''}${documentPreview&&tab!=='settings'?nativeReceiptHtml(documentPreview,effectiveReceiptStyle()):''}${live()&&tab!=='settings'?customers.html()+reports.html():''}<div data-tpv-new-orders-status>${orderNoticeBanner()}</div><div data-tpv-body>${tab==='credits'?creditCollections.html():tab==='order-notices'?orderNoticeInbox(orderWatch.snapshot()):tab==='signature'?signaturePanel.html():tab==='offline-pending'?offlinePanel.html():tab==='barcodes'?barcodePanel.html():tab==='reference-actions'?referenceActionsHtml(live(),{parking:central()&&!!session&&!!adapter?.drafts&&canSell(),credits:central()&&canCustomer('view'),stock:!!session&&canReceiveStock()&&!payment,inventory:!!session&&canInventory()&&!payment,newProduct:!!session&&canSell()&&canCreateProduct()&&!payment,newCustomer:!!session&&canCustomer('view')&&canCustomer('create')&&!payment}):tab==='settings'?referenceSettingsHtml(referenceSection,{values:{viewMode:catalogueView,initialCategoryId,display:displayOptions,receipt:receiptStyle,customerDisplay:customerScreenOptions,search:searchOptions,catalogue:catalogueOptions},editable:(!live()&&!central())||!!workspacePreferences,draft:formValues['reference-preferences']||{},practice:!live()&&!central(),preview:receiptPreviewHtml({...receiptStyle,showTaxBreakdown:displayOptions.showTaxBreakdown,logoData:ticketBranding.logoData()}),giftPreview:giftReceiptPreviewHtml(receiptStyle),categories,connectedHtml:referenceConnectedSettingsHtml(),coveredIds:referenceConnectedCoverage(),onlineOrdersHtml:onOnlineOrders&&canOnlineOrders()?'<section class="tpv-settings-card"><h5>Avisos de pedidos online</h5>'+button('online-orders','Configurar avisos y detección de pedidos')+'</section>':'',scopeHtml:['General','Ticket','Caja','Estados y formas de pago','Permisos','Funciones especiales','Devoluciones','Códigos barras','Presupuestos'].includes(referenceSection)&&!live()&&generalSetupInvoke&&canAssign()?'':referenceSettingsScopeHtml(),generalSetupHtml:!live()&&generalSetupInvoke&&canAssign()?(referenceSection==='General'?'<div data-tpv-general-setup></div>':referenceSection==='Ticket'&&storeBrandingSetup?'<div data-tpv-receipt-setup></div>':referenceSection==='Caja'?'<div data-tpv-cash-setup></div>':referenceSection==='Estados y formas de pago'?'<div data-tpv-payment-setup></div>':referenceSection==='Permisos'?'<div data-tpv-permissions-setup></div>':referenceSection==='Funciones especiales'?'<div data-tpv-owned-special></div>':referenceSection==='Devoluciones'?'<div data-tpv-owned-returns></div>':referenceSection==='Códigos barras'?'<div data-tpv-owned-barcodes></div>':referenceSection==='Presupuestos'?'<div data-tpv-owned-budgets></div>':''):'',administrationHtml:canAssign()&&generalSetupInvoke?button('general-setup','Configurar General de la tienda'):canAssign()&&readConfiguration?button('assign','Configurar tiendas y cajas'): '',brandingHtml:(!live()||ticketBrandingStore)?ticketBranding.html():''}):tab==='settings-functional'?settingsHtml()+paymentSettingsHtml(drawerPayments,canAssign(),formValues['payment-settings']):tab==='configuration'&&configuration?`<section class="card card-pad"><h3>Configuración de TotusTPV</h3>${configurationHtml()}</section>`:reports.isOpen()?'':tab==='history'?historyHtml():tab==='budgets'?budgetsHtml():tab==='session'?sessionHtml():!session?openingHtml():tab==='drafts'?draftsHtml():tab==='stock'?stockHtml():tab==='inventory'?inventoryPanel.html(products,search):receipt?receiptHtml():saleHtml()}</div></div>${live()?productIntake.html(failure):''}${workstationOpen?workstationDialog({pending:busy,stores:context.stores,drawers:context.drawers,storeId:workstationStore,drawerId:workstationDrawer,userName:actor()?.full_name||'Usuario de Central',open:!!session,canSwitchUser:!!onChangeOperator&&operatorRules.switchEnabled,canSwitchDrawer:central()&&!hasDraft(),sessions:context.sessions||[]}):''}`;
  host.querySelectorAll('label').forEach(el=>el.classList.add('field'));
  reflectPaymentMethod();
  host.querySelectorAll('button,select,input').forEach(el=>{if(busy&&!(scanning&&el.matches('[data-tpv-search]')))el.disabled=true;});
  if(scanInputState){const next=host.querySelector('[data-tpv-search]');if(next){next.value=scanInputState.value;if(scanInputState.focused){next.focus();next.setSelectionRange(scanInputState.start,scanInputState.end);}}}
  const stationDialog=host.querySelector('.tpv-workstation-dialog');if(stationDialog){stationDialog.showModal();stationDialog.addEventListener('cancel',event=>{event.preventDefault();workstationOpen=false;render();});}
  const variantDialog=host.querySelector('.tpv-variant-dialog');if(variantDialog){variantDialog.showModal();variantDialog.addEventListener('cancel',event=>{event.preventDefault();if(!busy)variantDialog.querySelector('[data-tpv-action=back-products]').click();});}
  catalogueTable.mount(host);
  productIntake.mount(host);
  mountCashOptions(host);
  mountSettingsNavigation(host);
  const generalRoot=host.querySelector('[data-tpv-general-setup]');if(!busy&&!workstationOpen&&generalRoot)void generalSetup.open(generalRoot,{embedded:true});
  const paymentRoot=host.querySelector('[data-tpv-payment-setup]');if(!busy&&!workstationOpen&&paymentRoot)void paymentSetup.open(paymentRoot,{embedded:true});
  const permissionsRoot=host.querySelector('[data-tpv-permissions-setup]');if(!busy&&!workstationOpen&&permissionsRoot)void permissionsSetup.open(permissionsRoot,{embedded:true});
  for(const [key,panel]of Object.entries(ownedSetups)){const node=host.querySelector('[data-tpv-owned-'+key+']');if(!busy&&!workstationOpen&&node)void panel.open(node,{embedded:true});}
  const cashRoot=host.querySelector('[data-tpv-cash-setup]');if(!busy&&!workstationOpen&&cashRoot)void cashSetup.open(cashRoot,{embedded:true});
  const receiptRoot=host.querySelector('[data-tpv-receipt-setup]');if(!busy&&!workstationOpen&&receiptRoot)void receiptSetup.open(receiptRoot,{embedded:true});
  if(settingsScroll!=null&&tab==='settings'){const body=host.querySelector('[data-tpv-body]');if(body)body.scrollTop=settingsScroll;}
  if(tab==='signature')void signaturePanel.mountPreview(host);
  host.querySelector('.tpv-actions')?.addEventListener('toggle',fitActionsMenu);
  if(!busy&&tab==='history'&&focusOrderLookup){const field=host.querySelector('[data-tpv-order-search] [name=orderId]');if(field){field.focus();field.select();focusOrderLookup=false;}}
 }
 function referenceConnectedCoverage(){
  const ids=['CFG-02-01','CFG-01-03','CFG-03-04'];if(!live()){if(central()&&canAssign())ids.push('CFG-09-10');if(storeCheckoutRules&&canAssign())ids.push('CFG-04-04','CFG-04-10');if(central()&&storeCommercialSetup&&adapter?.collectCredit&&canAssign())ids.push('CFG-04-01','CFG-04-02');return ids;}
  if(catalogueTaxChange&&canEditProductTax())ids.push('CFG-01-06');if(can('edit'))ids.push('CFG-01-05','CFG-01-07');if(canSell())ids.push('CFG-01-04','CFG-09-10');
  if(operatorSettingsStore)ids.push('CFG-01-08','CFG-01-09');if(adapter?.operatorSwitchPolicy)ids.push('CFG-01-10');if(menuLinksStore)ids.push('CFG-01-11');
  if(nativeCheckout.isLoaded()&&canAssign())ids.push('CFG-04-04','CFG-04-10');if(nativeLoyalty.isLoaded()&&canAssign())ids.push('CFG-02-36');if(nativePromotion.isLoaded()&&canAssign())ids.push('CFG-02-17');
  if(numbering)ids.push('CFG-02-03','CFG-02-06','CFG-02-07','CFG-02-08');
  ids.push('CFG-03-05');if(canAssign()&&readConfiguration)ids.push('CFG-03-01','CFG-03-02','CFG-03-03','CFG-05-01','CFG-05-02');
  if(cashVisibilityStore)ids.push('CFG-03-06');if(drawerPayments){ids.push('CFG-03-07','CFG-04-08','CFG-04-09','CFG-04-11','CFG-04-12');const methods=Object.keys(drawerPayments.options?.labels||{});if(methods.includes('transfer'))ids.push('CFG-04-06');if(methods.includes('card'))ids.push('CFG-04-07');if(methods.includes('cheque'))ids.push('CFG-04-03');if(methods.includes('cash')&&methods.length>1)ids.push('CFG-04-04');}
  if(adapter?.actionPolicy)ids.push('CFG-05-05','CFG-05-06','CFG-05-07');
  if(barcodeRules)ids.push('CFG-06-09','CFG-12-01','CFG-12-02','CFG-12-03');
  if(storeOrderNotices&&live())ids.push('CFG-06-02');if(signaturePolicyStore)ids.push('CFG-06-03','CFG-06-04');if(onOnlineOrders&&canOnlineOrders())ids.push('CFG-06-01');if(can('edit'))ids.push('CFG-06-10');if(returnPolicyStore)ids.push('CFG-07-01','CFG-07-04');
  return ids;
 }
 const settingsDrawer=()=>context?.drawers.find(row=>row.id===(settingsDrawerId||session?.drawerId||selectedDrawer));
 const settingsSource=()=>settingsAdapter||adapter;
 async function changeSettingsScope(drawerId){
  if(!live()||!createLiveAdapter)throw Error('Selecciona una tienda conectada para configurar otros puestos.');
  const drawer=context.drawers.find(row=>row.id===drawerId);if(!drawer)throw Error('No tienes acceso a esta caja.');
  if(((nativePromotion.hasDraft()||nativeCheckout.hasDraft())||nativeLoyalty.hasDraft()||ticketBranding.hasDraft()||Object.keys(formValues).some(key=>key!=='ticket'))&&!await askCurrent('¿Cambiar de puesto y descartar los ajustes sin guardar?',{acceptLabel:'Cambiar puesto'}))return;
  const run=generation,owner=identity(),candidate=createLiveAdapter();
  await candidate.context();await candidate.selectWorkstation({storeId:drawer.storeId,drawerId:drawer.id});
  if(run!==generation||owner!==identity()||!host)throw Error('La sesión ha cambiado.');
  const previousId=settingsDrawerId,previousAdapter=settingsAdapter;
  if(!settingsDrawerId)saleCatalogueBeforeSettings={categoryId,productPage,variantProduct,variantGroupId,catalogueSort,parentCatalogueSort,products,search};
  settingsDrawerId=drawer.id;settingsAdapter=candidate;
  try{await loadWorkspacePreferences();}catch(error){settingsDrawerId=previousId;settingsAdapter=previousAdapter;throw error;}
  formValues=formValues.ticket?{ticket:formValues.ticket}:{};formDirty=Object.keys(formValues).length>0;
  configuration=null;configurationId=null;notice='Configurando '+(context.stores.find(row=>row.id===drawer.storeId)?.name||'la tienda')+' · '+drawer.name+'. El puesto de venta se conserva.';
 }
 async function restoreSaleSettings(){
  if(!settingsDrawerId)return;
  if(((nativePromotion.hasDraft()||nativeCheckout.hasDraft())||nativeLoyalty.hasDraft()||ticketBranding.hasDraft()||Object.keys(formValues).some(key=>key!=='ticket'))&&!await askCurrent('¿Volver a la venta y descartar los ajustes sin guardar?',{acceptLabel:'Volver a la venta'}))return;
  const previousId=settingsDrawerId,previousAdapter=settingsAdapter;
  settingsDrawerId='';settingsAdapter=null;
  try{await loadWorkspacePreferences();}catch(error){settingsDrawerId=previousId;settingsAdapter=previousAdapter;throw error;}
  formValues=formValues.ticket?{ticket:formValues.ticket}:{};formDirty=Object.keys(formValues).length>0;
  if(saleCatalogueBeforeSettings){({categoryId,productPage,variantProduct,variantGroupId,catalogueSort,parentCatalogueSort,products,search}=saleCatalogueBeforeSettings);saleCatalogueBeforeSettings=null;}
  configuration=null;configurationId=null;
 }
 function referenceSettingsScopeHtml(){
  const drawer=settingsDrawer()||context.drawers[0],storeId=drawer?.storeId,store=context.stores.find(row=>row.id===storeId);
  return `<div class="tpv-settings-scope"><label><small>TIENDA QUE CONFIGURAS</small><select data-tpv-settings-store aria-label="Tienda que configuras" ${!live()?'disabled':''}>${context.stores.map(row=>`<option value="${esc(row.id)}" ${row.id===storeId?'selected':''}>${esc(row.name)}</option>`).join('')}</select></label><label><small>CAJA</small><select data-tpv-settings-drawer aria-label="Caja que configuras" ${!live()?'disabled':''}>${context.drawers.filter(row=>row.storeId===storeId).map(row=>`<option value="${esc(row.id)}" ${row.id===drawer?.id?'selected':''}>${esc(row.name)}</option>`).join('')}</select></label><details class="tpv-info-help"><summary aria-label="Ayuda: ámbito de la configuración">i</summary><div role="note">${settingsDrawerId?'La venta sigue en su tienda y caja originales. ':''}Los ajustes personales se guardan para tu cuenta y esta caja. Los ajustes compartidos se identifican en cada apartado.</div></details></div>`;
 }
 function barcodeSettingsHtml(compact=false){
  if(!barcodeRules)return '';
  const editing=canStock()&&settingsDrawer()?.canReconcile===true,values=formValues['barcode-settings']?barcodeOptionsFromForm(new Map(Object.entries(formValues['barcode-settings']))):barcodeRules;
  return `<form data-tpv-form="barcode-settings"><h4>Códigos de la tienda</h4>${compact?`<input type="hidden" name="barcodeField" value="${esc(values.field)}"><label class="tpv-check"><input type="checkbox" name="barcodeGeneratorEnabled" ${values.generatorEnabled?'checked':''} ${editing?'':'disabled'}> Activar generación de códigos faltantes</label>`:barcodeOptionsHtml(values,editing)}<button type="submit" class="btn primary" ${editing?'':'disabled'}>Guardar configuración de códigos</button></form>`;
 }
 function referenceConnectedSettingsHtml(){
  if(!live()&&!(central()&&referenceSection==='Interfaz')&&referenceSection!=='Personalización')return '';
  const policyDraft=group=>formValues['reference-policy']?.policyGroups?.includes(group)?new Map(Object.entries(formValues['reference-policy'])):null;
  const policy=(groups,body)=>groups.length?`<form data-tpv-form="reference-policy">${groups.map(group=>`<input type="hidden" name="policyGroups" value="${group}">`).join('')}${body}<button type="submit" class="btn primary">Guardar ajustes del puesto</button></form>`:'';
  const admin=()=>canAssign()&&readConfiguration?`<section class="tpv-settings-access"><h4>Tiendas, cajas y usuarios</h4><p>Selecciona el establecimiento, su caja y la persona cuyo acceso vas a configurar.</p>${configuration?configurationHtml():button('assign','Cargar tiendas, cajas y usuarios')}</section>`:'';
  switch(referenceSection){
   case 'General':return `<div class="tpv-general-connected">`+`<section class="tpv-setting-facts"><h4>Moneda del mostrador</h4><dl><div><dt>Moneda de cobro</dt><dd>Euro · EUR</dd></div></dl><details class="tpv-info-help"><summary aria-label="Ayuda: moneda del mostrador">i</summary><div role="note">Los precios, cobros y arqueos de este mostrador se registran en euros. El TPV todavía no admite otras monedas.</div></details></section>`+policy([...(can('edit')?['lineOptions']:[]),...(canSell()?['parking']:[])],(can('edit')?lineOptionsHtml(policyDraft('lineOptions')?lineOptionsFromForm(policyDraft('lineOptions')):priceRules,true,{showNote:false}):'')+(canSell()?parkingOptionsHtml(policyDraft('parking')?parkingOptionsFromForm(policyDraft('parking')):parkingRules,true):''))+(catalogueTaxChange&&canEditProductTax()?taxPreferenceHtml(formValues['tax-preference']?{allowTaxChanges:formValues['tax-preference'].allowTaxChanges==='on'}:taxRules,true):'')+(operatorSettingsStore?operatorSettingsHtml(operatorRules,canAssign(),formValues['operator-settings']):'')+(adapter?.operatorSwitchPolicy?operatorSwitchPolicyHtml(operatorAuthRules,canAssign(),formValues['operator-auth-settings']):'')+(menuLinksStore?menuLinksHtml(customMenuLinks,formValues['menu-links']):'')+`</div>`;
   case 'Ticket':return (numbering?receiptSeriesHtml(numbering,can('edit'),formValues['receipt-series']):'')+(canAssign()?nativeLoyalty.html().replace('data-setup-ticket-loyalty','data-setup-ticket-loyalty data-native-loyalty')+nativePromotion.html().replace('data-setup-ticket-promotion','data-setup-ticket-promotion data-native-promotion'):'');
   case 'Caja':return `<section class="tpv-setting-facts"><h4>Control de caja</h4><label class="tpv-check"><input type="checkbox" checked disabled> Caja abierta obligatoria para vender</label><p>Cada venta y movimiento queda vinculado a su tienda, caja y operador. Esta comprobación siempre está activa.</p></section>`+policy(['cash'],cashOptionsHtml(policyDraft('cash')?{denominations:(formValues['reference-policy'].cashDenominations||[]).map(Number)}:cashStyle))+admin()+(cashVisibilityStore?cashVisibilityHtml(cashVisibilityRules,canAssign(),formValues['cash-visibility']):'')+paymentSettingsHtml(drawerPayments,canAssign(),formValues['payment-settings']);
   case 'Estados y formas de pago':return (canAssign()?nativeCheckout.html().replace('data-setup-checkout-rules','data-setup-checkout-rules data-native-checkout'):'')+paymentSettingsHtml(drawerPayments,canAssign(),formValues['payment-settings']);
   case 'Permisos':return admin()+(adapter?.actionPolicy?sensitiveSettingsHtml(sensitiveRules,canAssign(),formValues['sensitive-settings']):'');
   case 'Funciones especiales':return nativeOrderNoticeForm()+(can('edit')?policy(['lineOptions'],lineOptionsHtml(policyDraft('lineOptions')?lineOptionsFromForm(policyDraft('lineOptions')):priceRules,true,{showPrice:false,showName:false})):'')+(signaturePolicyStore?signatureOptionsHtml(signatureRules,canSignatureSettings(),formValues['signature-policy']):'')+(onOnlineOrders&&canOnlineOrders()?`<section><h4>Avisos de pedidos online</h4>${button('online-orders','Abrir avisos de pedidos')}</section>`:'')+barcodeSettingsHtml(true);
   case 'Interfaz':return (central()?canAssign():canSell())?policy(['stockPolicy'],stockPolicyHtml(policyDraft('stockPolicy')?stockPolicyFromForm(policyDraft('stockPolicy'),{central:central()}):stockRules,true,{central:central()})):'';
   case 'Devoluciones':return returnPolicyStore?returnPolicyHtml(returnRules,canReturnPolicy(),formValues['return-policy']):'';
   case 'Personalización':return `<section><h4>Apariencia compartida con Central</h4><p>El TPV utiliza tus colores, tipografía, bordes y formas de Totus Central. Cambia el estilo desde la configuración común para mantener un entorno coherente.</p>${onAppearance&&canAppearance()?button('central-appearance','Abrir apariencia de Central'):'<p>Tu cuenta no tiene acceso a la configuración de apariencia.</p>'}</section>`;
   case 'Clientes':return customerSettingsStore?customerOptionsHtml(customerRules,canAssign(),formValues['customer-settings']):'';
   case 'Presupuestos':return budgetSettingsStore?budgetOptionsHtml(budgetRules,canAssign(),formValues['budget-settings']):'';
   case 'Códigos barras':return barcodeRules?barcodeSettingsHtml()+`<section><h4>Generación y etiquetas</h4><p>Los códigos existentes se conservan. El generador revisa productos y variantes antes de escribir y permite recuperar un trabajo interrumpido.</p>${!settingsDrawerId||settingsDrawerId===(session?.drawerId||selectedDrawer)?button('barcodes','Abrir generación y etiquetas'):'<p>La configuración de esta tienda está lista. Para generar sus códigos, entra en su puesto de venta y abre Códigos de barras desde Más acciones.</p>'}</section>`:'';
   default:return '';
  }
 }
 function settingsHtml(){const draftView=formValues.preferences?.viewMode||catalogueView,draftCategory=Number(formValues.preferences?.initialCategoryId??initialCategoryId);return `<section class="card card-pad tpv-settings"><h3>Configuración de TotusTPV</h3><form data-tpv-form="preferences"><h4>Mostrador · tu cuenta y esta caja</h4><label>Vista al iniciar<select name="viewMode">${[['grid','Fotos'],['compact','Compacta'],['list','Lista'],['table','Tabla']].map(([id,label])=>`<option value="${id}" ${id===draftView?'selected':''}>${label}</option>`).join('')}</select></label><label>Categoría al iniciar<select name="initialCategoryId"><option value="0">Todas las categorías</option>${categories.map(c=>`<option value="${c.id}" ${c.id===draftCategory?'selected':''}>${esc(c.label)}</option>`).join('')}</select></label><fieldset><legend>Artículos y ticket</legend>${displayPreferencesHtml(formValues.preferences?displayPreferencesFromForm(new Map(Object.entries(formValues.preferences))):displayOptions)}</fieldset>${searchPreferencesHtml(formValues.preferences?searchSettingsDraft():searchOptions)}${cataloguePreferencesHtml(formValues.preferences?cataloguePreferencesFromForm(new Map(Object.entries(formValues.preferences))):catalogueOptions,categories)}${lineOptionsHtml(formValues.preferences?lineOptionsFromForm(new Map(Object.entries(formValues.preferences))):priceRules,can('edit'))}${parkingOptionsHtml(formValues.preferences&&canSell()?parkingOptionsFromForm(new Map(Object.entries(formValues.preferences))):parkingRules,canSell())}${stockPolicyHtml(formValues.preferences&&canSell()?stockPolicyFromForm(new Map(Object.entries(formValues.preferences))):stockRules,canSell())}${receiptOptionsHtml(receiptSettingsDraft())}${cashOptionsHtml(cashSettingsDraft())}${customerDisplayOptionsHtml(formValues.preferences?customerDisplayOptionsFromForm(new Map(Object.entries(formValues.preferences))):customerScreenOptions)}<section class="tpv-receipt-preview" aria-label="Vista previa del justificante"><h4>Vista previa</h4><div data-tpv-receipt-preview>${receiptPreviewHtml(receiptSettingsDraft())}</div><details data-tpv-gift-preview-shell ${receiptSettingsDraft().showGiftDiscounts?'open':''}><summary>Vista previa del ticket regalo</summary><div data-tpv-gift-preview>${giftReceiptPreviewHtml(receiptSettingsDraft())}</div></details></section><p class="small muted">Se guarda en tu cuenta de Central y se recupera en otros ordenadores. Las columnas de la vista Tabla se configuran desde su propio botón Columnas.</p><button class="btn primary" type="submit">Guardar mostrador</button></form>${numbering?receiptSeriesHtml(numbering,can('edit'),formValues['receipt-series']):''}${budgetSettingsStore?budgetOptionsHtml(budgetRules,canAssign(),formValues['budget-settings']):''}${customerSettingsStore?customerOptionsHtml(customerRules,canAssign(),formValues['customer-settings']):''}${menuLinksStore?menuLinksHtml(customMenuLinks,formValues['menu-links']):''}${operatorSettingsStore?operatorSettingsHtml(operatorRules,canAssign(),formValues['operator-settings']):''}${adapter?.actionPolicy?sensitiveSettingsHtml(sensitiveRules,canAssign(),formValues['sensitive-settings']):''}${adapter?.operatorSwitchPolicy?operatorSwitchPolicyHtml(operatorAuthRules,canAssign(),formValues['operator-auth-settings']):''}${cashVisibilityStore?cashVisibilityHtml(cashVisibilityRules,canAssign(),formValues['cash-visibility']):''}${returnPolicyStore?returnPolicyHtml(returnRules,canReturnPolicy(),formValues['return-policy']):''}${signaturePolicyStore?signatureOptionsHtml(signatureRules,canSignatureSettings(),formValues['signature-policy']):''}${onOnlineOrders&&canOnlineOrders()?`<section class="tpv-order-notices"><h4>Avisos de pedidos online</h4><p>Consulta los avisos y la detección automática de Central. Puedes revisar un aviso sin perder el ticket que estás preparando.</p>${button('online-orders','Abrir avisos de pedidos')}</section>`:''}${canAssign()&&readConfiguration?`<div class="tpv-settings-admin"><h4>Puestos y operadores</h4><p>Asigna establecimientos, cajas y medios de cobro a los usuarios de Central.</p>${button('assign','Configurar puesto y operadores')}</div>`:''}</section>`;}
 function effectiveReceiptStyle(){return {...receiptStyle,showTaxBreakdown:displayOptions.showTaxBreakdown,logoData:ticketBranding.savedLogo()};}
 function receiptSettingsDraft(){return {...(formValues.preferences?receiptOptionsFromForm(new Map(Object.entries(formValues.preferences))):receiptStyle),showTaxBreakdown:formValues.preferences?formValues.preferences.showTaxBreakdown==='on':displayOptions.showTaxBreakdown};}
 function cashSettingsDraft(){const selected=formValues.preferences?.cashDenominations;return selected===undefined?cashStyle:{denominations:(Array.isArray(selected)?selected:[selected]).map(Number)};}
 function updateReceiptPreview(target){
  if(target.form?.dataset.tpvForm==='reference-preferences'&&referenceSection==='Ticket'){
   const preview=host?.querySelector('[data-tpv-reference-preview]'),feedback=host?.querySelector('[data-tpv-reference-preview-feedback]');
   try{const next=applyReferencePreferences({viewMode:catalogueView,initialCategoryId,display:displayOptions,receipt:receiptStyle,customerDisplay:customerScreenOptions,search:searchOptions,catalogue:catalogueOptions},Array.from(new FormData(target.form)));
    if(preview)preview.innerHTML=receiptPreviewHtml({...next.receipt,showTaxBreakdown:next.display.showTaxBreakdown,logoData:ticketBranding.logoData()});const gift=host?.querySelector('[data-tpv-gift-preview]'),shell=host?.querySelector('[data-tpv-gift-preview-shell]');if(gift)gift.innerHTML=giftReceiptPreviewHtml(next.receipt);if(shell&&target.name==='CFG-02-31')shell.open=next.receipt.showGiftDiscounts;if(feedback)feedback.textContent='Vista previa actualizada · guarda para conservar los cambios.';
   }catch{if(feedback)feedback.textContent='Completa los campos para actualizar la vista previa.';}return;
  }
  if(!target.name?.startsWith('receipt-')&&target.name!=='showTaxBreakdown')return;
  const options={...receiptOptionsFromForm(new FormData(target.form)),showTaxBreakdown:new FormData(target.form).get('showTaxBreakdown')==='on'},preview=host?.querySelector('[data-tpv-receipt-preview]'),giftPreview=host?.querySelector('[data-tpv-gift-preview]');if(preview)preview.innerHTML=receiptPreviewHtml(options);if(giftPreview)giftPreview.innerHTML=giftReceiptPreviewHtml(options);if(target.name==='receipt-showGiftDiscounts'){const shell=host?.querySelector('[data-tpv-gift-preview-shell]');if(shell)shell.open=options.showGiftDiscounts;}}
 function configurationConnectionHtml(){const choices=configuration?.connections;if(!Array.isArray(choices)||choices.length<2)return '';return `<label>Web conectada<select data-tpv-config-connection aria-label="Web conectada"><option value="" ${!configuration.connectionId?'selected':''} disabled>Selecciona la web para este puesto</option>${choices.map(row=>`<option value="${esc(row.connectionId)}" ${row.connectionId===configuration.connectionId?'selected':''}>${esc(row.name)} · ${esc(row.origin)}</option>`).join('')}</select></label>`;}
 function configurationHtml(){if(configuration?.mode==='connect-website')return `<section class="tpv-configuration tpv-connection-empty"><span class="tpv-connection-symbol" aria-hidden="true">${workstationIcon('store')}</span><h4>Conecta tu primera web</h4><p>Añade y verifica la conexión de tu tienda en Central. Después podrás elegirla aquí y asignar las cajas y personas que van a trabajar con ella.</p><ol><li>Conecta la web con su API.</li><li>Comprueba que su conexión esté verificada.</li><li>Vuelve aquí para preparar el puesto.</li></ol><div class="inline-actions">${onConfigure&&canConfigure()?button('configure','Abrir conexiones','primary'):''}${button('refresh-configuration','Ya está conectada · actualizar')}${button('cancel-configuration','Volver')}</div></section>`;if(configuration?.mode==='register-target')return `<section class="tpv-configuration"><h4>Preparar esta web para TotusTPV</h4>${configurationConnectionHtml()}<p><strong>${esc(configuration.origin)}</strong></p><p>La conexión está verificada en Central. El siguiente paso la registra para preparar sus tiendas, cajas y usuarios. Después se comprobará la compatibilidad del conector antes de permitir ventas.</p><p class="small muted">Este paso no crea pedidos ni copia credenciales. Las webs actuales de producción permanecen protegidas.</p><div class="inline-actions">${button('register-target','Preparar esta web','primary')}${button('cancel-configuration','Cancelar')}</div></section>`;if(configuration?.mode==='choose-connection')return `<section class="tpv-configuration"><h4>Configurar tienda y caja</h4><p>Selecciona la web con la que trabajará este puesto.</p>${configurationConnectionHtml()}${button('cancel-configuration','Cancelar')}</section>`;if(accessBatch.isOpen())return accessBatch.html();if(accessPanel.isEditing())return accessPanel.html();const c=configuration,store=c.stores.some(row=>row.id===formValues.configure?.store)?formValues.configure.store:c.stores[0]?.id,
  drawers=c.drawers.filter(row=>row.store_id===store);
  return `<form data-tpv-form="configure" class="tpv-configuration"><h4>Asignar tienda y caja</h4>${configurationConnectionHtml()}<p>${esc(c.origin)} · conexión verificada, revisión ${c.revision}. Selecciona establecimientos y usuarios ya registrados en Central.</p>
   <div class="inline-actions">${drawerManagement()?`<a class="btn" href="${esc(drawerManagement())}" target="_blank" rel="noopener">Crear y gestionar cajas ↗</a>`:''}${button('refresh-configuration','Actualizar tiendas y cajas')}</div><p class="small muted">La gestión se abre en otra pestaña. Al volver, actualiza esta lista para ver las cajas guardadas. Tus selecciones y el ticket se conservan.</p>
   <label>Establecimiento<select name="store" data-tpv-config-store required>${c.stores.map(row=>`<option value="${esc(row.id)}" ${row.id===store?'selected':''}>${esc(row.name)}</option>`).join('')}</select></label>
   <label>Caja<select name="drawer" required ${drawers.length?'':'disabled'}>${drawers.length?'':'<option value="">Todavía no hay cajas en este establecimiento</option>'}${drawers.map(row=>`<option value="${esc(row.id)}" ${row.id===formValues.configure?.drawer?'selected':''}>${esc(row.name)}</option>`).join('')}</select></label>
   ${!c.stores.length?'<p class="note" role="status">Crea primero un establecimiento y su caja desde Crear y gestionar cajas. Después pulsa Actualizar tiendas y cajas.</p>':!drawers.length?'<p class="note" role="status">Este establecimiento todavía no tiene cajas. Crea una caja y actualiza esta lista para poder asignarla.</p>':''}
   <label>Operador<select name="operator" required>${c.operators.map(row=>`<option value="${esc(row.id)}" ${row.id===(formValues.configure?.operator||c.actorId)?'selected':''}>${esc(row.full_name||row.id)}</option>`).join('')}</select></label>
   <label>Tienda nativa de PrestaShop<input name="shop" type="number" min="1" step="1" required value="${esc(formValues.configure?.shop||'1')}"></label>
   <fieldset><legend>Medios de cobro · efectivo y tarjeta incluidos</legend>${['bizum','transfer','cheque'].map(method=>`<label class="tpv-check"><input name="${method}" type="checkbox" ${formValues.configure?.[method]==='on'?'checked':''}> Habilitar ${paymentLabel(method)} confirmado por el cajero</label>`).join('')}<small>Habilita sólo medios que utilice el establecimiento. Un pago pendiente de recibir no se registra como cobrado.</small></fieldset>
   <label>Uso del mostrador<select name="role"><option value="sell">Vender y consultar pedidos</option><option value="view" ${formValues.configure?.role==='view'?'selected':''}>Consultar pedidos</option></select></label>
   <label class="tpv-check"><input name="cashAccess" type="checkbox" ${!formValues.configure||formValues.configure.cashAccess==='on'?'checked':''}> Permitir abrir, gestionar efectivo y cerrar caja</label>
   <label class="tpv-check"><input name="accepted" type="checkbox" required> Preparar el perfil de pruebas y asignar los permisos seleccionados. Se crearán únicamente los datos auxiliares de mostrador que falten en preproducción.</label>
   <div class="inline-actions"><button class="btn primary" type="submit" ${busy||!drawers.length||!c.operators.length?'disabled':''}>Preparar y asignar puesto</button>${button('cancel-configuration','Cancelar')}</div>
   <small>Requiere la capacidad nativa de Totus y su permiso API en la web de pruebas. Este formulario no instala software ni modifica permisos de los demás módulos.</small></form>${accessPanel.html()}`;}
 function setupHtml(){return `<section class="tpv-setup" aria-label="Estado del puesto"><h4>Webs y cajas registradas</h4>
  ${setup.websites.map(row=>`<article><div><strong>${esc(row.websiteName)}</strong><small>${esc(row.origin||'Dirección de web no verificada')}</small></div>
   <div><span>${row.connectionVerified?'API verificada':'API pendiente de verificación'}</span><small>${esc(row.storeName||'Sin establecimiento asignado')}</small>
   <small>${row.storeId?(row.drawers.length?row.drawers.map(drawer=>esc(drawer.name)).join(' · '):'Sin cajas activas'):'Asigna primero su establecimiento en Conexiones.'}</small></div></article>`).join('')||'<p>No hay webs registradas disponibles para tu cuenta.</p>'}
  <p class="small muted">Esta consulta no habilita ventas. La asignación del operador, el circuito de pedido y la sesión de caja siguen pendientes de comprobar.</p></section>`;}
 function openingHtml(){if(live()&&!canManageCash())return `<section class="card card-pad tpv-opening"><h3>Caja sin abrir</h3><p>Tu acceso no permite abrir esta caja. Puedes revisar pedidos e informes y actualizar las cajas para comprobar si una persona autorizada ya la ha abierto.</p>${button('refresh-workstation','Actualizar cajas')}</section>`;return `<section class="card card-pad tpv-opening"><header class="tpv-opening-heading"><span>${workstationIcon('drawer')}</span><div><small>EMPIEZA TU JORNADA</small><h3>${wording('Abre tu caja de práctica','Todo listo para abrir caja')}</h3><p>Revisa el puesto y cuenta el efectivo inicial.</p></div></header><div class="tpv-opening-context"><div><small>TIENDA</small><strong>${esc(context.stores.find(r=>r.id===(selectedStore||context.stores[0]?.id))?.name||'Selecciona la tienda')}</strong></div><div><small>CAJA</small><strong>${esc(context.drawers.find(r=>r.id===(selectedDrawer||context.drawers[0]?.id))?.name||'Selecciona la caja')}</strong></div><div><small>OPERADOR</small><strong>${esc(actor()?.full_name||'Tu cuenta de Central')}</strong></div>${button('show-workstation','Cambiar puesto')}</div>
  <form data-tpv-form="open"><label>Fondo inicial · €<input name="opening" inputmode="decimal" value="${esc(formValues.open?.opening??(live()||central()?'':'100,00'))}" required></label>${cashCountHtml('opening',cashStyle,formValues.open)}
  <button class="btn primary" type="submit" ${canManageCash()?'':'disabled'}>${wording('Abrir caja de práctica','Abrir caja')}</button></form></section>`;}
 function previewUnit(line){const local=currentBasketPreview(),index=lines.indexOf(line);if(!payment&&local&&index>=0)return local.units[index];if(!payment&&line.discountKind==='price'){try{const cents=inputCents(line.discountValue);return cents>0?cents:null;}catch{return null;}}return line.pricePending?null:line.unitCents;}
 let basketPreview=null,basketPriceRevision=0,basketPriceTimer=null;
 const basketPriceKey=()=>JSON.stringify([generation,identity(),session?.id,selectedCustomer,lines.map(l=>[l.productId,l.qty,l.discountKind,l.discountValue])]);
 function currentBasketPreview(){return basketPreview&&basketPreview.key===basketPriceKey()&&Date.now()<basketPreview.validUntil?basketPreview:null;}
 async function refreshBasketPrices(){
  if(!live()||payment)return;
  const revision=++basketPriceRevision,key=basketPriceKey();basketPreview=null;clearTimeout(basketPriceTimer);
  for(const line of lines)line.pricePending=true;
  reflectLineTotals();
  if(!lines.length||!adapter.localBasketPrices||lines.some(l=>l.discountKind&&l.discountKind!=='none'))return;
  try{
   const result=await adapter.localBasketPrices({lines:lines.map(l=>{const [productId,attributeId=0]=String(l.productId).split(':').map(Number);return {productId,attributeId,qty:l.qty};})});
   if(!host||!allowed()||payment||revision!==basketPriceRevision||key!==basketPriceKey()||Date.now()>=result.validUntil)return;
   const c=result.pricingContext,subtotal=roundPriceSubtotal(result.lines.map(l=>({unitMicros:l.unitTaxInclMicros,quantity:l.qty})),{mode:c.roundMode,type:c.roundType,computingPrecision:c.computingPrecision});
   basketPreview={key,validUntil:result.validUntil,units:result.lines.map(l=>roundPriceMicros(l.unitTaxInclMicros,c.roundMode)),amounts:subtotal.balancedLineCents};
   reflectLineTotals();basketPriceTimer=setTimeout(()=>{basketPreview=null;if(host)reflectLineTotals();},Math.max(1,result.validUntil-Date.now()));
  }catch{/* Missing local prices remain pending until the native quote is available. */}
 }
 function previewLine(line){if(payment&&Number.isSafeInteger(line.totalCents))return line.totalCents;const local=currentBasketPreview(),index=lines.indexOf(line);if(local&&index>=0)return local.amounts[index];const unit=previewUnit(line);return unit===null?null:unit*line.qty;}
 function previewTotal(){if(live()&&!payment&&(formValues.ticket?.discountKind||formValues.ticket?.coupon?.trim()))return null;const values=lines.map(previewLine);return values.some(value=>value===null)?null:values.reduce((sum,value)=>sum+value,0);}
 function reflectLineTotals(){for(const input of host?.querySelectorAll('[data-tpv-quantity]')||[]){const line=lines.find(row=>row.productId===input.dataset.tpvQuantity);if(!line)continue;const root=input.closest('.tpv-ticket-line'),amount=root?.querySelector(':scope > b'),unit=root?.querySelector(':scope > div > small');const warning=root?.querySelector('[data-tpv-stock-warning]');if(warning){warning.textContent=stockWarning(line);warning.hidden=!warning.textContent;}if(amount)amount.textContent=previewLine(line)===null?'—':money(previewLine(line));if(unit)unit.textContent=previewUnit(line)===null?'Precio pendiente de recalcular':money(previewUnit(line))+' / ud.';}
  for(const total of host?.querySelectorAll('.tpv-ticket-total strong,.tpv-mobile-total strong')||[])total.textContent=previewTotal()===null?'Por calcular':money(previewTotal());customerScreen.sync();}
 function shownLines(){if(!live()||!payment?.lines?.length)return displayOptions.ticketNewestFirst?[...lines].reverse():lines;
  const rows=payment.lines.map(row=>{const key=row.productId+':'+row.attributeId,source=lines.find(line=>line.productId===key);
   return {...source,productId:key,name:source?.name||'Artículo #'+row.productId+(row.attributeId?' · variante #'+row.attributeId:''),qty:row.qty,
    unitCents:Math.round(row.unitTaxInclMicros/10000),totalCents:row.lineTaxInclCents,pricePending:false};});
  return displayOptions.ticketNewestFirst?rows.reverse():rows;}
 const currentCatalogueFilters=()=>({hideUnavailable:['stock','inventory'].includes(tab)?false:catalogueOptions.hideUnavailable,excludedCategories:['stock','inventory'].includes(tab)?[]:catalogueOptions.excludedCategories});
 const inventoryCatalogueQuery=()=>tab==='inventory'||tab==='stock'&&includeDisabledStock?{inventoryOnly:true}:{};
 const visibleCategories=(stock=tab==='stock')=>stock?categories:visibleCatalogueCategories(categories,catalogueOptions.excludedCategories);
 function catalogueControlsHtml(){
 if(variantProduct)return '';
 const selectedCategory=categories.find(c=>c.id===categoryId),parentCategory=categories.find(c=>c.id===selectedCategory?.parentId);
 const view=`<label>Vista<select data-tpv-view>${[['grid','Fotos'],['compact','Compacta'],['list','Lista'],['table','Tabla']].map(([id,label])=>`<option value="${id}" ${id===catalogueView?'selected':''}>${label}</option>`).join('')}</select></label>${catalogueView==='table'?catalogueTable.settingsHtml():''}`;
 return `<div class="tpv-catalogue-controls ${central()?'tpv-controls-compact':''}"><label>Categoría<select data-tpv-category ${categories.length&&!busy?'':'disabled'}><option value="0">Todas las categorías</option>${visibleCategories().map(c=>`<option value="${c.id}" ${c.id===categoryId?'selected':''}>${esc(c.label)}</option>`).join('')}</select></label>${central()?`<details class="tpv-catalogue-options"><summary aria-label="Opciones del catálogo" title="Vista y columnas del catálogo">⚙</summary><div>${view}</div></details>`:view}${central()&&selectedCategory?`<button type="button" class="btn secondary tpv-category-back" data-tpv-reference-category="${parentCategory?.id||0}" aria-label="← ${esc(parentCategory?.name||'Todas las categorías')}" title="Volver a ${esc(parentCategory?.name||'Todas las categorías')}">←</button>`:''}</div>`;
}
  function catalogueProductHtml(p,stock){
 const blocked=p.offlineUnavailable||!stock&&!canSellProduct(p,stockRules)||!stock&&!p.chooseVariant&&p.stock<=0&&!canExceedStock(p,stockRules)||!(stock?canReceiveStock():canSell())||payment;
 const price=cataloguePriceCents(p,displayOptions.priceMode),details=[['Referencia',p.reference],['Existencias',p.stock===null?'Sin comprobar':p.chooseVariant?'Por variante':String(p.stock)],['Estado',p.offlineUnavailable?'Faltan datos de venta':p.saleEnabled===false?(canSellProduct(p,stockRules)?'Desactivado en la web · venta TPV permitida':'Desactivado en la web'):'Disponible'],['Variante',variantDetails(p)],['Venta sin stock',canExceedStock(p,stockRules)?'Permitida en este TPV':'No permitida'],['Precio',price===null?'Sin comprobar':money(price)+(displayOptions.priceMode==='net'?' sin IVA':' con IVA')],['Datos',catalogueOptions.extraDetails?catalogueDetails(p):'']].filter(([,value])=>value!==''&&value!==undefined);
 return `<article class="tpv-catalogue-card"><button type="button" class="tpv-product" ${stock?'data-tpv-stock':'data-tpv-add'}="${esc(p.id)}" ${blocked?'disabled':''} title="${esc(p.name)}">${displayOptions.showStock?`<small class="tpv-card-units" title="Existencias: ${esc(p.stock===null?'sin comprobar':p.stock)}">${p.chooseVariant?'Por variante':p.stock===null?'Stock: —':'Stock: '+esc(p.stock)+' '+esc(p.quantityUnit&&p.quantityUnit!=='unit'?p.quantityUnit:'uds.')}</small>`:''}${p.imageUrl?`<img src="${esc(p.imageUrl)}" alt="" loading="lazy" decoding="async" width="88" height="88" referrerpolicy="no-referrer">`:`<div class="tpv-product-placeholder">${productIcon}</div>`}<span><strong>${esc(p.name)}</strong>${displayOptions.showReferences&&p.reference?`<small class="tpv-card-reference">${esc(p.reference)}</small>`:''}</span>${displayOptions.showPrices?`<b>${price===null?'Precio no disponible':money(price)}</b>`:''}</button><details class="tpv-product-info"><summary aria-label="Información de ${esc(p.name)}" title="Información del artículo">i</summary><div role="note"><strong>${esc(p.name)}</strong><dl>${details.map(([label,value])=>`<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl></div></details></article>`;
}
 function catalogueItemsHtml(stock=false){
 if(busy&&!products.length)return '<p class="tpv-empty" role="status">Consultando el catálogo de esta categoría…</p>';
 const view=variantProduct?variantView:catalogueView;
 if(products.building)return priceBuildHtml(products.building);
 if(view==='table')return catalogueTable.html(products,{sortField:catalogueSort.field,sortDirection:catalogueSort.direction,canSelect:stock?canReceiveStock():canSell(),stock,stockPolicy:stockRules});
 return `<div class="tpv-product-list tpv-view-${view}">${!stock&&viewCategoryTiles()?categoryTiles().map(c=>`<button type="button" class="tpv-reference-category" data-tpv-reference-category="${c.id}">${folderIcon}<span>${esc(central()?c.name:c.label)}</span></button>`).join(''):''}${products.map(p=>catalogueProductHtml(p,stock)).join('')||'<p class="tpv-empty">No hay artículos con esa búsqueda.</p>'}</div>`;
}
  function variantDialogHtml(){return `<dialog class="tpv-variant-dialog" aria-labelledby="tpv-variant-heading"><header><div><p class="small muted">Selecciona una variante</p><h3 id="tpv-variant-heading">${esc(variantProductName)}</h3></div>${button('back-products','Volver a productos')}</header>${failure?`<p role="alert" class="note bad">${esc(failure)}</p>`:''}<div class="tpv-variant-controls"><label>Atributo para ordenar<select data-tpv-variant-group><option value="0">Todos los atributos</option>${(products.variantGroups||[]).map(row=>`<option value="${row.id}" ${row.id===variantGroupId?'selected':''}>${esc(row.name)}</option>`).join('')}</select></label><label>Orden<select data-tpv-variant-order>${Object.entries(TPV_VARIANT_ORDERS).map(([id,label])=>`<option value="${id}" ${id===catalogueSort.field+':'+catalogueSort.direction?'selected':''}>${label}</option>`).join('')}</select></label><label>Vista<select data-tpv-view>${[['table','Tabla'],['grid','Fotos'],['compact','Compacta'],['list','Lista']].map(([id,label])=>`<option value="${id}" ${id===variantView?'selected':''}>${label}</option>`).join('')}</select></label>${variantView==='table'?catalogueTable.settingsHtml():''}</div>${catalogueItemsHtml()}<footer class="inline-actions">${button('catalogue-previous','Anterior','secondary',productPage===0)}<span>Página ${productPage+1}${Number.isSafeInteger(products.totalCount)?' · '+products.totalCount+' variantes':''}</span>${button('catalogue-next','Siguiente','secondary',!products.hasMore)}</footer></dialog>`;}
 const quickPaymentMethods=()=>allowedPaymentForms(drawerPayments?.options?.enabledMethods||['cash','card']);
 const categoryTiles=()=>{const visible=visibleCategories();if(!central())return visible;const ids=new Set(visible.map(c=>c.id));return visible.filter(c=>categoryId?c.parentId===categoryId:!ids.has(c.parentId));};
 const viewCategoryTiles=()=>catalogueView==='grid'&&(central()?categoryTiles().length>0:categoryId===0&&visibleCategories().length>0);
 function saleHtml(){return `<div class="tpv-sale-grid tpv-layout-${displayOptions.layout} tpv-pane-${mobilePane} ${payment?'tpv-checkout-grid':''}"><div class="tpv-mobile-switch">${button('show-products','Catálogo')}${button('show-ticket','Ticket · '+lines.reduce((n,l)=>n+l.qty,0))}</div><section class="tpv-panel tpv-catalogue" aria-label="Artículos" ${payment?'hidden':''}>

  ${products.offlineCached?'<p role="status" class="note">Sin conexión · catálogo guardado. Los precios y existencias pueden haber cambiado.</p>'+ (products.offlineCoveragePartial?'<p class="small muted">La búsqueda incluye Productos. Las variantes sólo incluyen las consultadas anteriormente; los artículos sin datos de venta guardados no se pueden añadir todavía.</p>':''):''}${products.cacheUnavailable?'<p role="status" class="note">No se pudo guardar este catálogo para consultarlo sin conexión.</p>':''}${catalogueControlsHtml()}${variantProduct?variantDialogHtml():catalogueItemsHtml()}
  ${(live()||central())&&!variantProduct?`<div class="inline-actions">${variantProduct?button('back-products','Volver a productos'):''}${button('catalogue-previous','Anterior','secondary',productPage===0)}<span>Página ${productPage+1}${Number.isSafeInteger(products.productCount)?' · '+products.productCount+' productos · '+products.totalCount+' artículos':Number.isSafeInteger(products.totalCount)?' · '+products.totalCount+' artículos':''}</span>${button('catalogue-next','Siguiente','secondary',!products.hasMore)}</div>`:''}</section>
  <section class="tpv-panel tpv-ticket" aria-label="Ticket actual"><header><h3>${wording('Ticket de práctica','Venta actual')}</h3>${draftInfo?`<small>Ticket recuperado · ${esc(draftInfo.label)}</small>`:''}<span>${esc(wording('Cliente de mostrador ficticio',selectedCustomer?selectedCustomer.name+' · '+selectedCustomer.addressLabel:'Cliente de mostrador'))}</span>${!payment?button('customers','＋ Elegir cliente','secondary',!(live()||central())||!canCustomer('view')):''}</header>
  <div class="tpv-ticket-lines">${shownLines().map(l=>`<div class="tpv-ticket-line"><div><strong>${esc(l.name)}</strong>${(live()||central())&&!payment&&!returnForm&&catalogueTaxChange&&canEditProductTax()&&taxRules.allowTaxChanges?`<button type="button" class="tpv-line-name-button" data-tpv-line-tax="${esc(l.productId)}" aria-label="Editar impuesto de ${esc(l.name)}">Impuesto del producto</button>`:''}${(live()||central())&&!payment&&canSell()&&(l.customName||can('edit')&&priceRules.allowNameChanges&&(central()||l.temporaryLineNames))?`<button type="button" class="tpv-line-name-button" data-tpv-line-name="${esc(l.productId)}" aria-label="Cambiar nombre de ${esc(l.name)}">Cambiar nombre</button>`:''}<small>${previewUnit(l)===null?'Precio pendiente de recalcular':money(previewUnit(l))+' / ud.'}</small><small class="tpv-stock-warning" data-tpv-stock-warning ${stockWarning(l)?'':'hidden'}>${esc(stockWarning(l))}</small></div>
   <label class="tpv-quantity">Unidades<input type="number" min="${l.minimumQty||1}" max="10000" step="1" data-tpv-quantity="${esc(l.productId)}" value="${l.qty}" ${payment||!canSell()?'disabled':''}></label>
   <b>${previewLine(l)===null?'—':money(previewLine(l))}</b><button type="button" class="btn secondary" aria-label="Quitar ${esc(l.name)}" data-tpv-remove="${esc(l.productId)}" ${payment||!canSell()?'disabled':''}>×</button>
   ${(live()||central()&&(priceRules.allowPriceChanges||l.discountKind==='price'))&&!payment&&can('edit')?`<div class="tpv-line-discount"><label>Precio y descuento por unidad<select data-tpv-line-kind="${esc(l.productId)}"><option value="">Precio original</option>${live()?`<option value="percent" ${l.discountKind==='percent'?'selected':''}>Porcentaje · %</option><option value="amount" ${l.discountKind==='amount'?'selected':''}>Importe · €</option>`:''}${priceRules.allowPriceChanges&&(central()||l.unitPriceOverride)||l.discountKind==='price'?`<option value="price" ${l.discountKind==='price'?'selected':''} ${!priceRules.allowPriceChanges?'disabled':''}>Fijar precio final · €</option>`:''}</select></label>${l.discountKind?`<label>${l.discountKind==='price'?'Precio final por unidad · €':'Valor'}<input data-tpv-line-value="${esc(l.productId)}" inputmode="decimal" value="${esc(l.discountValue??'')}"></label>`:''}</div>`:''}</div>`).join('')||`<div class="tpv-ticket-welcome"><span>${workstationIcon('cart')}</span><strong>Tu ticket empieza aquí</strong><p>Selecciona un artículo o escanea su código</p></div>`}</div>
  ${!payment?`<footer class="tpv-ticket-footer"><div class="tpv-ticket-total"><span>Estimación antes de descuentos</span><strong>${previewTotal()===null?'Por calcular':money(previewTotal())}</strong></div>`:''}
  ${live()&&!payment?`<details class="tpv-ticket-options" ${priceRules.requireSaleNote||formValues.ticket?.note||formValues.ticket?.discountKind||formValues.ticket?.coupon?'open':''}><summary>Opciones del ticket</summary><form data-tpv-form="ticket" class="tpv-ticket-adjustments"><label class="tpv-sale-note">Nota interna${priceRules.requireSaleNote?' · obligatoria para cobrar':' · opcional'}<textarea name="note" rows="2" placeholder="Solo visible para el equipo">${esc(formValues.ticket?.note??'')}</textarea><small>Solo para el equipo · Hasta 500 caracteres.</small></label><label>Descuento del ticket<select name="discountKind" ${!can('edit')?'disabled':''}><option value="">Sin descuento manual</option><option value="percent" ${formValues.ticket?.discountKind==='percent'?'selected':''}>Porcentaje · %</option><option value="amount" ${formValues.ticket?.discountKind==='amount'?'selected':''}>Importe · €</option></select></label><label>Valor del descuento<input name="discountValue" inputmode="decimal" value="${esc(formValues.ticket?.discountValue??'')}" ${!can('edit')?'disabled':''}></label><label>Cupón de la tienda<input name="coupon" maxlength="100" value="${esc(formValues.ticket?.coupon??'')}" ${!can('edit')?'disabled':''}></label><label>Nombre para aparcar<input name="draftLabel" maxlength="120" placeholder="Opcional" value="${esc(formValues.ticket?.draftLabel??draftInfo?.label??'')}"></label></form></details>`:''}
  ${!payment?`<div class="inline-actions">${button('clear','Vaciar ticket','secondary',!lines.length&&!draftInfo||!canSell())}${(live()||central()&&adapter?.park)?button('park','Aparcar ticket','secondary',!lines.length||!canSell()||!parkingRules.enabled):''}${live()?button('save-budget','Guardar presupuesto','secondary',!lines.length||!canSell()):''}<div class="tpv-reference-payments" role="group" aria-label="Medios de cobro">${quickPaymentMethods().map(method=>{const label=drawerPayments?.options?.labels?.[method]||paymentLabel(method);return `<button type="button" class="${quickPaymentMethod===method?'active':''}" data-tpv-quick-method="${method}" ${!quickPaymentMethods().includes(method)?'disabled title="No está habilitado en esta caja"':''}>${esc(label)}</button>`;}).join('')}${live()?button('save-budget','Presupuesto','secondary',!lines.length||!canSell()):''}${button('payment','FINALIZAR','primary',!lines.length||!canSell())}</div></div>${live()&&!parkingRules.enabled?'<p class="small muted" role="status">El aparcado está desactivado para tu cuenta y esta caja. Los tickets anteriores siguen en Más acciones · Tickets aparcados.</p>':''}`:''}
  ${!payment?'</footer>':''}${payment?paymentHtml():''}</section><div class="tpv-mobile-total"><strong>${previewTotal()===null?'Por calcular':money(previewTotal())}</strong>${button('show-ticket','Ver ticket','primary',!lines.length)}</div></div>`;}
 const allowedPaymentForms=methods=>paymentFormMethods(methods).filter(id=>id!=='mixed'||checkoutStyle.allowMixed);
 function paymentHtml(){return `<form data-tpv-form="pay" class="tpv-payment"><h4>${payment.localEstimate?'Cobro sin conexión':wording('Cobro de práctica','Cobro · cálculo verificado en la tienda')}</h4>${payment.localEstimate?'<p>Importe calculado con el catálogo guardado. La venta quedará pendiente de comprobar y registrar cuando vuelva la conexión.</p>':''}${payment.discountCents?`<p>Descuento del ticket: −${money(payment.discountCents)}</p>`:''}${taxSummaryHtml(payment,displayOptions.showTaxBreakdown)}<p class="tpv-payment-amount">Total <strong>${money(payment.totalCents)}</strong></p>
  <label>Forma de pago<select name="method" data-tpv-method>${allowedPaymentForms(payment.paymentMethods).map(key=>`<option value="${key}" ${paymentValues.method===key?'selected':''}>${esc(payment.paymentLabels?.[key]||paymentLabel(key))}${!live()?' · práctica':''}</option>`).join('')}</select></label>
  <label data-tpv-external-method hidden>Segundo medio de pago<select name="externalMethod">${(payment.paymentMethods||['cash','card']).filter(method=>method!=='cash').map(method=>`<option value="${method}" ${paymentValues.externalMethod===method?'selected':''}>${esc(payment.paymentLabels?.[method]||paymentLabel(method))}</option>`).join('')}</select></label>
  <label data-tpv-cash-part hidden>Parte en efectivo · €<input name="cashPart" inputmode="decimal" value="${esc(paymentValues.cashPart??'0,00')}"></label>
  <label data-tpv-received>Efectivo recibido · €<input name="received" inputmode="decimal" placeholder="0,00" value="${esc(paymentValues.received??'')}" autocomplete="off"></label>${cashCountHtml('received',cashStyle,paymentValues)}
  <div class="tpv-denominations" data-tpv-denominations role="group" aria-label="Efectivo entregado">
   <button type="button" class="btn secondary" data-tpv-tender-exact>Importe exacto</button>
   ${cashStyle.denominations.filter(face=>face>=500).map(face=>`<button type="button" class="btn secondary" data-tpv-tender="${face}" aria-label="Entregado ${face/100} euros">${face/100} €</button>`).join('')}
  </div>
  ${paymentReferenceFields(payment,paymentValues)}<output class="tpv-tender-preview" data-tpv-tender-preview role="status" aria-label="Cambio del cobro" aria-live="polite"></output>
  <label class="tpv-check" data-tpv-card-accept hidden><input type="checkbox" name="cardAccepted" ${paymentValues.cardAccepted==='on'?'checked':''}> ${wording('Acepto el pago externo ficticio','He comprobado que el cobro externo está recibido. TotusTPV registra el cobro; no opera el datáfono ni el banco.')}</label>
  ${!live()?`<label>Simular resultado<select name="scenario">${[['normal','Venta correcta'],['lost-response','Respuesta perdida: recuperar sin repetir'],['rejected','Pago rechazado']].map(([key,label])=>`<option value="${key}" ${paymentValues.scenario===key?'selected':''}>${label}</option>`).join('')}</select></label>`:''}
  <div class="inline-actions">${button('cancel-payment','Volver al ticket')}<button class="btn primary" type="submit">${payment.localEstimate?'Guardar venta en este dispositivo':wording('Confirmar venta de práctica','Confirmar cobro y crear pedido')}</button></div></form>`;}
 function receiptHtml(){if(receipt.localQueued)return `<section class="card card-pad tpv-receipt tpv-receipt-pending" aria-label="Resultado de venta"><span class="tpv-receipt-status" aria-hidden="true">↻</span><h3>Venta guardada en este dispositivo</h3><p><b>${esc(receipt.reference)}</b> · ${money(receipt.totalCents)}</p><p>Cambio: ${money(receipt.changeCents||0)}</p><p>Se enviará automáticamente cuando vuelva la conexión. No vuelvas a cobrar esta venta.</p><small>Pendiente de registrar en la tienda.</small><div class="inline-actions">${button('recover','Sincronizar ahora','primary')}${button('next','Nuevo ticket')}</div></section>`;if(receipt.status==='cancelled')return `<section class="card card-pad tpv-receipt tpv-receipt-cancelled"><span class="tpv-receipt-status" aria-hidden="true">—</span><h3>Intento cerrado sin pedido</h3><p>Se conserva la incidencia y su revisión. No se ha vuelto a enviar la venta.</p>${button('next','Nuevo ticket','primary')}</section>`;const uncertain=receipt.status!=='confirmed';return `<section class="card card-pad tpv-receipt ${uncertain||receipt.needsReview?'tpv-receipt-pending':'tpv-receipt-confirmed'}" aria-label="Resultado de venta"><span class="tpv-receipt-status" aria-hidden="true">${uncertain||receipt.needsReview?'!':'✓'}</span><h3>${receipt.needsReview?'Venta pendiente de revisión':uncertain?'Respuesta pendiente de recuperar':central()?'Venta registrada en Central':wording('Venta de práctica registrada','Pedido verificado en PrestaShop')}</h3>
  <p><b>${esc(receipt.reference)}</b> · ${money(receipt.totalCents)}</p>${uncertain?'':taxSummaryHtml(receipt,displayOptions.showTaxBreakdown)}${central()&&!uncertain?`<dl><div><dt>Cobrado</dt><dd>${money(receipt.paidCents||0)}</dd></div><div><dt>Saldo pendiente</dt><dd>${money(receipt.outstandingCents||0)}</dd></div>${receipt.dueDate?`<div><dt>Vencimiento</dt><dd>${esc(receipt.dueDate)}</dd></div>`:''}</dl>`:''}<p>${receipt.needsReview?'El cálculo o los datos de la venta necesitan revisión. No se enviará automáticamente ni debes volver a cobrar al cliente.':uncertain?'No confirmes otro ticket para repetir esta venta. Recupera el resultado de la misma operación.':wording('Cambio de práctica: ','Cambio devuelto: ')+money(receipt.changeCents||0)}</p>
  <small>${wording('Simulación: no existe pedido ni pago real en PrestaShop.',uncertain?'No se ha confirmado el resultado; consulta la misma operación.':central()?'Venta y cobros guardados en Central.':'Pedido y pago registrados en preproducción.')}</small><div class="inline-actions">${uncertain?button('recover','Recuperar resultado','primary'):button('next','Nuevo ticket','primary')}${(live()||central())&&!uncertain?documentButtons(receipt.id):''}${live()&&uncertain&&canAssign()?button('review-incident','Revisar incidencia'):''}</div>${incidentForm?`<form data-tpv-form="incident" class="tpv-payment"><h4>Cerrar intento sin pedido</h4><p>El servidor comprobará que la ejecución terminó sin pedido. Revisa también que no quede ningún cobro externo pendiente.</p><label>Resultado de la revisión<select name="settlementReview"><option value="not-collected">No se recibió ningún cobro</option><option value="returned-externally">Cobro externo devuelto y comprobado</option></select></label><label>Motivo y comprobación<input name="reason" minlength="10" maxlength="500" required></label><label class="tpv-check"><input name="accepted" type="checkbox" required> He revisado el cobro y confirmo este resultado.</label><button class="btn primary" type="submit">Verificar y cerrar incidencia</button></form>`:''}</section>`;}
 function documentButtons(id){if(central())return `<button type="button" class="btn secondary" data-tpv-document="receipt" data-sale-id="${esc(id)}">Ver ticket</button><button type="button" class="btn secondary" data-tpv-document="gift" data-sale-id="${esc(id)}">Ticket regalo</button>`;return `<details class="tpv-document-actions" ${busy?'inert':''}><summary class="btn secondary">Documentos</summary><div class="inline-actions">${[['receipt','Ticket'],['gift','Ticket regalo'],['invoice','Factura PDF'],['delivery','Albarán PDF']].map(([kind,label])=>`<button type="button" class="btn secondary" data-tpv-document="${kind}" data-sale-id="${esc(id)}">${label}</button>`).join('')}${live()&&typeof adapter?.findInvoiceSignature==='function'?`<button type="button" class="btn secondary" data-tpv-signature-sale="${esc(id)}">${signatureRules.enabled&&canSell()&&session?'Firmar factura':'Factura firmada'}</button>`:''}${live()&&onBilling&&canBilling()?`<button type="button" class="btn secondary" data-tpv-billing="${esc(id)}">Ver en Facturación</button>`:''}</div></details>`;}
 function draftsHtml(){return `<section class="card card-pad tpv-records"><header class="inline-actions"><h3>Tickets aparcados · esta caja</h3>${button('refresh-drafts','Actualizar tickets')}</header><p class="small muted">Se muestran los últimos 100. Al recuperar se recalculan precios, impuestos y disponibilidad.</p>
  <div class="tpv-history">${parked.map(row=>{const expiry=parkingExpiry(row),current=row.status==='checkout'&&row.mine&&row.sessionId===session.id,
   available=central()?row.status==='parked'||row.mine&&row.sessionId===session.id:row.status==='parked'||row.mine||row.sessionId!==session.id;
   return `<article><div><strong>${esc(row.label)}</strong><small>${row.lineCount} líneas · ${expiry.expired?'Caducado':row.status==='parked'?'Aparcado':row.mine?'En uso por ti':'En uso por otro operador'}</small><small>${expiry.expiresAt?'Validez hasta '+esc(new Date(expiry.expiresAt).toLocaleString('es-ES')):'Sin caducidad'}${expiry.expired?' · Se conserva para consulta y archivo.':''}</small></div>
    ${current?`<button type="button" class="btn secondary" data-tpv-recover="${esc(row.checkoutId)}">${expiry.expired?'Consultar cobro pendiente':'Continuar cobro'}</button>`:`<button type="button" class="btn secondary" data-tpv-draft-id="${esc(row.id)}" ${!available||expiry.expired||!canSell()?'disabled':''}>Recuperar ticket</button>`}
    ${canSell()&&can('edit')&&(row.status==='parked'||row.status==='claimed'&&row.mine)?`<button type="button" class="btn secondary" data-tpv-archive-draft="${esc(row.id)}">Archivar</button>`:''}</article>`;}).join('')||'<p>No hay tickets aparcados en esta caja.</p>'}</div></section>`;}
 function historyHtml(){return `<section class="card card-pad tpv-records"><h3>${wording('Tickets de esta sesión de práctica','Pedidos y devoluciones · esta tienda')}</h3>${live()||central()?`<form data-tpv-order-search class="inline-actions"><label>Número o referencia<input name="orderId" value="${esc(orderLookup)}" inputmode="text" maxlength="${central()?23:15}" placeholder="Escanea o escribe el pedido"></label><button class="btn secondary" type="submit">Buscar pedido</button>${button('history',session?'Sesión actual':'Pedidos de esta tienda')}${receiptStyle.showOnlineTickets&&typeof adapter.webOrders==='function'?button('web-orders','Pedidos de la web'):''}</form><p class="small muted" role="status">${esc(notice.startsWith('Historial:')?notice:'Sesión actual · últimos 100 registros. Busca un pedido de sesiones anteriores para reimprimir o devolver.')}</p>`:''}<div class="tpv-history">${history.map(op=>`<article><div><b>${esc(op.reference)}</b><small>${op.external?'Pedido existente en la web':op.status==='confirmed'?wording('Registrado en práctica','Pedido registrado'):op.status==='ready'?'Cobro preparado; sin confirmar':op.status==='cancelled'?'Incidencia revisada · sin pedido':'Pendiente de recuperar'}${op.createdAt?' · '+esc(new Date(op.createdAt).toLocaleString('es-ES')):''}</small></div><strong>${op.external?esc(new Intl.NumberFormat('es-ES',{style:'currency',currency:op.currency}).format(op.totalCents/100)):money(op.totalCents)}</strong>
   ${op.external?`<button type="button" class="btn secondary" data-tpv-web-receipt="${esc(op.orderId)}" ${!receiptStyle.showOnlineTickets?'disabled':''}>Ticket del pedido</button>`:op.status!=='confirmed'?`<button type="button" class="btn secondary" data-tpv-recover="${esc(op.id)}">${op.status==='ready'?'Continuar cobro':op.status==='cancelled'?'Ver incidencia':'Recuperar'}</button>`:`<button type="button" class="btn secondary" data-tpv-return="${esc(op.id)}" ${!session||!canSell()?'disabled':''}>Devolver</button>`}
   ${(live()||central())&&!op.external&&op.status==='confirmed'?documentButtons(op.id):''}${(op.refunds||[]).map(r=>r.status==='confirmed'?`<button type="button" class="btn secondary" data-tpv-document="credit-note" data-sale-id="${esc(op.id)}" data-refund-id="${esc(r.id)}">${central()?'Ver abono':'Abono PDF'} · ${money(r.totalCents)}</button>`:['ready','dispatched','uncertain'].includes(r.status)?`<button type="button" class="btn secondary" data-tpv-refund-recover="${esc(r.id)}">Devolución pendiente · ${money(r.totalCents)}</button>`:'').join('')}</article>`).join('')||`<div class="tpv-record-empty"><span>${workstationIcon('cart')}</span><strong>No hay pedidos en esta consulta</strong><p>Aquí encontrarás las ventas, sus tickets y devoluciones.</p>${button('sale','Volver al mostrador')}</div>`}</div>${returnForm?returnHtml():''}</section>`;}
 function originalReturnReferences(){return `${live()&&Object.keys(returnForm.originalPaymentReferences||{}).length?`<section aria-label="Referencias del cobro original"><h4>Referencias del cobro original</h4>${Object.entries(returnForm.originalPaymentReferences).map(([method,reference])=>`<p>${esc(paymentLabel(method))} · ${esc(reference)}</p>`).join('')}<small>Úsalas para localizar el cobro. Comprueba el reintegro en el terminal antes de confirmarlo aquí.</small></section>`:''}`;}
 function returnHtml(){if((live()||central())&&returnForm.prepared){const r=returnForm.prepared;return `<section class="tpv-payment"><h4>Confirmar devolución · ${esc(returnForm.reference)}</h4>${originalReturnReferences()}<strong>${money(r.totalCents)}</strong>
  ${r.payments?`<p>${r.payments.map(p=>`${paymentLabel(p.method)}: ${money(p.amountCents)}`).join(' · ')}</p>`:''}
  ${r.reason?`<p>Motivo: ${esc(r.reason)}</p>`:''}<p>${r.status==='ready'?'Revisa el importe. Devuelve el efectivo o comprueba el reintegro en el datáfono antes de confirmar.':'Resultado pendiente. No repitas el reintegro; recupera esta misma devolución.'}</p>
  <div class="inline-actions">${r.status==='ready'?button('cancel-return','Cancelar preparación')+button('confirm-refund','Confirmo el reintegro al cliente','primary'):button('recover-refund','Recuperar devolución','primary')}</div></section>`;}
  return `<form data-tpv-form="refund" class="tpv-payment"><h4>${wording('Devolución de práctica','Preparar devolución')} · ${esc(returnForm.reference)}</h4><p>${wording('El reintegro ficticio usa los medios de pago de la venta original.','Selecciona unidades y reposición. El siguiente paso mostrará los importes nativos antes de confirmar el reintegro.')}</p>
  ${originalReturnReferences()}
  <div class="inline-actions">${button('return-all','Seleccionar todas las unidades pendientes')}${button('return-clear','Quitar selección de unidades')}</div>
  ${returnForm.lines.map(line=>`<div class="tpv-return-line"><strong>${esc(line.name)}</strong><label>Cantidad a devolver (máx. ${line.remainingQty})<input name="qty-${esc(line.productId)}" type="number" min="0" max="${line.remainingQty}" step="${line.quantityUnit&&line.quantityUnit!=='unit'?'0.001':'1'}" value="${esc(formValues.refund?.['qty-'+line.productId]??'0')}"></label>
   <label class="tpv-check"><input name="restock-${esc(line.productId)}" type="checkbox" ${!formValues.refund||formValues.refund['restock-'+line.productId]==='on'?'checked':''}> ${wording('Reponer existencias de práctica','Reponer estas unidades en la tienda')}</label></div>`).join('')}
  ${(live()||central())?`<label>Reintegro<select name="refundMethod" ${returnForm.requireOriginalPayment?'disabled':''}><option value="original">${returnForm.requireOriginalPayment?'Reparto proporcional obligatorio':'Repartir entre los medios originales'}</option>${Object.entries(returnForm.availablePayments||{}).filter(([,amount])=>amount>0).map(([method,amount])=>`<option value="${esc(method)}" ${formValues.refund?.refundMethod===method?'selected':''}>${esc(paymentLabel(method))} · hasta ${money(amount)}</option>`).join('')}</select></label><label>Motivo de la devolución<input name="reason" maxlength="500" required value="${esc(formValues.refund?.reason||'')}"></label>`:''}
  ${!live()&&!central()?`<label class="tpv-check"><input type="checkbox" name="refundAccepted" required ${formValues.refund?.refundAccepted==='on'?'checked':''}> Confirmo el reintegro ficticio; no se devuelve dinero real</label>`:''}
  <div class="inline-actions">${button('cancel-return','Cancelar devolución')}<button type="submit" class="btn primary">${wording('Registrar devolución de práctica','Calcular devolución')}</button></div></form>`;}
 function sessionHtml(){if(!session)return `<section class="card card-pad tpv-session"><header class="tpv-screen-heading"><span>${workstationIcon('drawer')}</span><div><h3>Caja y arqueo</h3><p>${esc(context.stores.find(row=>row.id===selectedStore)?.name||'')} · ${esc(context.drawers.find(row=>row.id===selectedDrawer)?.name||'')}</p></div>${button('show-workstation','Cambiar puesto')}</header><p role="status">Esta caja no tiene una sesión abierta.</p><p>Cuando abras la caja, aquí podrás consultar el saldo, registrar entradas y retiradas de efectivo y realizar el arqueo y cierre.</p>${button('sale','Preparar apertura','primary')}</section>`;return `<section class="card card-pad tpv-session"><header class="tpv-screen-heading"><span>${workstationIcon('drawer')}</span><div><h3>${wording('Caja de práctica','Caja y arqueo')}</h3><p>Consulta el efectivo y prepara el cierre de tu caja.</p></div>${button('sale','Volver al mostrador')}</header>${summary?`${summary.cashSummaryHidden?'<p role="status">Los importes del resumen están ocultos para tu cuenta. Introduce el efectivo que has contado, sin consultar un saldo esperado.</p>':`<dl><div><dt>Fondo inicial</dt><dd>${money(summary.openingCents)}</dd></div><div><dt>${wording('Ventas de práctica','Ventas registradas')}</dt><dd>${money(summary.salesCents)}</dd></div>
  <div><dt>Ventas en efectivo</dt><dd>${money(summary.cashCents)}</dd></div><div><dt>Reintegros en efectivo</dt><dd>${money(summary.refundCashCents||0)}</dd></div><div><dt>Efectivo esperado</dt><dd>${money(summary.expectedCashCents)}</dd></div>${['card','bizum','transfer','cheque'].filter(method=>summary.payments?.[method]||summary.refunds?.[method]).map(method=>`<div><dt>${esc(paymentLabel(method))} · cobros / reintegros</dt><dd>${money(summary.payments?.[method]||0)} / ${money(summary.refunds?.[method]||0)}</dd></div>`).join('')}</dl>`}
  ${(live()||central())&&canManageCash()?`<form data-tpv-form="movement"><h4>Movimiento de efectivo</h4><label>Tipo<select name="kind"><option value="cash-in">Entrada de efectivo</option><option value="cash-out" ${formValues.movement?.kind==='cash-out'?'selected':''}>Retirada de efectivo</option></select></label><label>Importe · €<input name="amount" inputmode="decimal" required value="${esc(formValues.movement?.amount??'')}"></label><label>Motivo<input name="reason" required maxlength="500" value="${esc(formValues.movement?.reason??'')}"></label><button class="btn secondary" type="submit">Registrar movimiento</button></form>`:''}
  ${summary.unresolved?'<p role="status">Recupera las ventas o devoluciones pendientes en el historial antes de cerrar.</p>':''}<form data-tpv-form="close"><h4>Arqueo y cierre</h4><fieldset class="tpv-cash-fields" ${canManageCash()?'':'disabled'}><label>Efectivo contado · €<input name="counted" inputmode="decimal" required value="${esc(formValues.close?.counted??(summary.cashSummaryHidden?'':(summary.expectedCashCents/100).toFixed(2).replace('.',',')))}"></label>${cashCountHtml('counted',cashStyle,formValues.close)}${live()?`<label>Observaciones del arqueo<input name="note" maxlength="500" value="${esc(formValues.close?.note??'')}"></label>`:''}<button class="btn primary" type="submit" ${summary.unresolved||!canManageCash()?'disabled':''}>${wording('Cerrar caja de práctica','Cerrar caja')}</button></fieldset>${canManageCash()?'':'<p class="small muted">Tu acceso permite consultar esta caja. Los movimientos y el cierre corresponden a una persona autorizada para gestionar efectivo.</p>'}</form>`:''}</section>`;}
 function stockHtml(){return `<section class="card card-pad tpv-stock"><header class="tpv-screen-heading"><span>${workstationIcon('store')}</span><div><h3>Entrada de mercancía</h3><p>Selecciona los artículos y revisa las unidades recibidas.</p></div>${button('sale','Volver al mostrador')}</header><div class="tpv-stock-catalogue">
  <label>Buscar producto<input type="search" inputmode="${searchOptions.numericKeyboard?'numeric':'search'}" data-tpv-search placeholder="${esc(searchOptions.fields.map(key=>TPV_SEARCH_FIELDS[key]).join(', '))}" value="${esc(search)}"></label>
  <label class="tpv-check"><input type="checkbox" data-tpv-disabled-stock data-draft-ignore ${includeDisabledStock?'checked':''} ${busy?'disabled':''}> Incluir artículos deshabilitados para reponer</label><p class="small muted">Reponer mercancía no activa estos artículos ni permite venderlos.</p>
  ${catalogueControlsHtml()}${catalogueItemsHtml(true)}
  <div class="inline-actions">${variantProduct?button('back-products','Volver a productos'):''}${button('catalogue-previous','Anterior','secondary',productPage===0)}${button('catalogue-next','Siguiente','secondary',!products.hasMore)}</div>
  </div>${stockIntake.html()}</section>`;}
 function searchSettingsDraft(){const values=formValues.preferences;if(!values)return searchOptions;
  // Preserve an empty selection so validation does not silently re-enable criteria.
  const fields=values.searchFields;return {fields:Array.isArray(fields)?fields:[],numericKeyboard:values.numericKeyboard==='on',includeDisabledStock:values.includeDisabledStock==='on'};}
 function rememberForm(target){const form=target.closest('[data-tpv-form]');if(!form||!host?.contains(form))return;
  const values=Object.fromEntries(new FormData(form));if(form.dataset.tpvForm==='reference-preferences')for(const select of form.querySelectorAll('select[multiple][name]'))values[select.name]=new FormData(form).getAll(select.name);formValues[form.dataset.tpvForm]=form.dataset.tpvForm==='reference-preferences'?{...formValues['reference-preferences'],...values}:values;
  if(['preferences','reference-policy'].includes(form.dataset.tpvForm)){values.policyGroups=new FormData(form).getAll('policyGroups');values.cashDenominations=new FormData(form).getAll('cashDenominations');values.searchFields=new FormData(form).getAll('searchFields');values.excludedCategories=new FormData(form).getAll('excludedCategories');}
  if(form.dataset.tpvForm==='pay')paymentValues=values;formDirty=true;}
 const hasDraft=()=>!!host&&(lines.length>0||!!draftInfo||!!payment||!!returnForm||formDirty||receipt?.status==='uncertain'||customers.hasDraft()||stockIntake.hasDraft()||(inventoryPanel.hasDraft()||ticketBranding.hasDraft())||productIntake.hasDraft()||accessPanel.hasDraft()||accessBatch.hasDraft()||signaturePanel.hasDraft()||generalSetup.hasDraft()||receiptSetup.hasDraft()||(cashSetup.hasDraft()||paymentSetup.hasDraft()||permissionsSetup.hasDraft()||Object.values(ownedSetups).some(panel=>panel.hasDraft()))||nativeLoyalty.hasDraft()||(nativePromotion.hasDraft()||nativeCheckout.hasDraft()));
 async function askCurrent(message,options){const run=generation,owner=identity();const accepted=await confirm(message,options);
  return accepted===true&&run===generation&&owner===identity()&&!!host;}
 async function requestLeave(){if(busy||generalSetup.isBusy()||receiptSetup.isBusy()||(cashSetup.isBusy()||paymentSetup.isBusy()||permissionsSetup.isBusy()||Object.values(ownedSetups).some(panel=>panel.isBusy())))return false;if(!hasDraft())return true;
  if(accessBatch.hasPending())return askCurrent('¿Salir de TotusTPV? La solicitud de accesos seguirá guardada para recuperar su resultado. Los demás cambios sin guardar se perderán.');
  return askCurrent(wording('¿Salir de TotusTPV? Los cambios sin confirmar se perderán. Los tickets de práctica pendientes seguirán en su historial.',
   '¿Salir y descartar los cambios sin aparcar? Los tickets aparcados y las operaciones registradas seguirán en el servidor.'));}
 function scheduleCatalogueRefresh(){clearTimeout(catalogueRefreshTimer);if(!products.building)return;
  const run=generation,query=search,category=categoryId,variant=variantProduct,owner=session?.id,currentTab=tab;
  catalogueRefreshTimer=setTimeout(()=>{if(!host||run!==generation||session?.id!==owner||tab!==currentTab||search!==query||categoryId!==category||variantProduct!==variant||catalogueSort.field!=='price')return;
   if(busy){scheduleCatalogueRefresh();return;}void work(reloadProducts);},1000);
 }
 async function reloadProducts(overrides={}){clearTimeout(catalogueRefreshTimer);products=await adapter.searchProducts({sessionId:session.id,search:variantProduct?'':search,page:productPage,productId:variantProduct,categoryId:variantProduct?0:categoryId,variantGroupId:variantProduct?variantGroupId:0,sortField:catalogueSort.field,sortDirection:catalogueSort.direction,searchFields:searchOptions.fields,catalogueFilters:currentCatalogueFilters(),...inventoryCatalogueQuery(),...overrides});scheduleCatalogueRefresh();}
 async function work(fn){if(busy)return;guard();busy=true;failure='';const run=generation;render();try{await fn();}catch(error){if(run===generation)failure=error.message||'No se pudo completar la operación.';}finally{if(run===generation){busy=false;render();if(onlineSyncRequested&&canSyncAfterReconnect())queueMicrotask(syncAfterReconnect);}}}

 async function confirmCentralCheckout(quote){
  const run=generation,owner=identity(),cashSession=session?.id;
  const current=()=>run===generation&&owner===identity()&&!!host&&allowed()&&session?.id===cashSession;
  const policy=await adapter.operatorCheckout({operationId:quote.id});
  if(!current())throw Error('El puesto ha cambiado. Conserva el ticket.');
  if(policy.required&&!policy.confirmed){
   const accepted=await confirmCentralOperator({name:actor()?.full_name||actor()?.email||'Tu cuenta de Central',total:money(quote.totalCents),isCurrent:current});
   if(!accepted||!current())throw Error('Confirmación cancelada. El ticket se conserva y no se ha enviado el cobro.');
   const observed=await adapter.operatorCheckout({operationId:quote.id,accepted:true});
   if(!current()||!observed.confirmed)throw Error('No se ha confirmado el operador. Conserva el ticket.');
  }
  await confirmCentralLinePrice(quote);
 }
 async function confirmCentralLinePrice(quote){
  if(!quote?.lines?.some(line=>line.priceOverride===true))return;
  const run=generation,owner=identity(),selectedSession=session?.id,current=()=>run===generation&&owner===identity()&&!!host&&allowed()&&canSell()&&session?.id===selectedSession;
  if(!current())throw Error('El puesto ha cambiado. Conserva el ticket.');
  const challenge=await adapter.priceChallenge({operationId:quote.id});if(!current())throw Error('El puesto ha cambiado.');
  if(!challenge.required||challenge.approved)return;
  if(typeof confirmPassword!=='function')throw Error('No se ha preparado la confirmación de cuenta. Conserva el ticket.');
  const approved=await passwordPrompt.request({account:actor()?.full_name||actor()?.email||'Mi cuenta',purpose:'este precio modificado · '+money(quote.totalCents),isCurrent:current,confirm:password=>confirmPassword({password,approve:proofJwt=>{if(!current())throw Error('El puesto ha cambiado.');return adapter.approvePrice({operationId:quote.id,proofJwt});}})});
  if(!approved||approved.quoteId!==quote.id||approved.approved!==true||!current())throw Error('Confirmación cancelada. El ticket se conserva y no se ha enviado el cobro.');
 }
 async function changeTab(next){if(next!=='history'&&notice.startsWith('Historial:'))notice='';if(tab==='settings'&&next!=='settings'&&central())await loadWorkspacePreferences();if(next==='inventory'){if(!session||!canInventory())throw Error('Abre una caja con permiso de inventario.');const store=context.stores.find(r=>r.id===session.storeId),drawer=context.drawers.find(r=>r.id===session.drawerId);inventoryPanel.open({connectionId:drawer?.connectionId,shopId:drawer?.shopId,storeId:session.storeId,storeName:store?.name||'',drawerName:drawer?.name||''});}if(next==='history')webHistory=false;barcodePanel.reset();searchRevision++;clearTimeout(searchTimer);if((tab==='stock')!==(next==='stock')){variantProduct=0;variantGroupId=0;productPage=0;catalogueSort=parentCatalogueSort||catalogueSort;parentCatalogueSort=null;}reports.reset();tab=next;if(session&&next==='sale'){if(categoryId&&!visibleCategories(false).some(row=>row.id===categoryId))categoryId=0;products=[];await reloadProducts();}if(!session&&(live()||central())&&next==='history'){history=central()?await adapter.history():await adapter.orders();orderLookup='';notice='Historial: últimos 100 pedidos confirmados de esta tienda.';focusOrderLookup=true;}if(session&&next==='history'){orderLookup='';if(notice.startsWith('Historial:'))notice='';history=await adapter.history({sessionId:session.id});focusOrderLookup=true;}if(session&&next==='session')summary=await adapter.sessionSummary({sessionId:session.id});if(session&&next==='drafts')parked=await adapter.drafts();if(session&&next==='stock'){await reloadProducts();await stockIntake.load();}if(session&&next==='inventory')await reloadProducts();}
 function canSyncAfterReconnect(){return !settingsDrawerId&&globalThis.navigator?.onLine!==false&&!!host&&allowed()&&mountedActor===identity()&&live()&&!!session&&!!adapter.offlineDelivery&&!returnForm&&(!payment||receipt?.status==='uncertain');}
 function queueSyncRetry(){clearTimeout(onlineSyncTimer);onlineSyncTimer=setTimeout(()=>{onlineSyncTimer=null;onlineSyncRequested=true;syncAfterReconnect();},30000);}
 function syncAfterReconnect(){
  if(!onlineSyncRequested||busy||!canSyncAfterReconnect())return;
  onlineSyncRequested=false;clearTimeout(onlineSyncTimer);onlineSyncTimer=null;void work(async()=>{
   const run=generation,owner=identity(),cashSession=session.id,deviceId=offlineDevice(storage),journal=localJournal(deviceId),delivery=await adapter.offlineDelivery({deviceId});
   const sync=createOfflineSync({journal,adapter:delivery,isCurrent:()=>run===generation&&owner===identity()&&allowed()&&!!host&&session?.id===cashSession,shouldSynchronize:row=>row.ticket.cashSessionId===cashSession});
   const result=await sync.synchronizePending();
   if(receipt?.status==='uncertain'){const saved=await journal.get(receipt.id);if(saved?.status==='synced'){
    try{await recover(receipt.id);}catch(error){
     if(error?.code==='TPV_CONNECTION_UNAVAILABLE'&&run===generation&&owner===identity()&&allowed()&&host&&session?.id===cashSession){
      notice='La venta está sincronizada. Se recuperará su resultado automáticamente cuando vuelva la conexión.';queueSyncRetry();return;
     }
     throw error;
    }
   }else if(saved?.status==='conflict')receipt={...receipt,localQueued:false,needsReview:true};}
   if(result.authorizationRequired){notice='Una venta guardada necesita confirmar tu cuenta. Abre Ventas pendientes de sincronizar y pulsa Sincronizar ahora.';}
   else if(result.pending){notice='Hay ventas guardadas pendientes de comprobar. Se volverá a intentar automáticamente; también puedes usar Sincronizar ahora.';queueSyncRetry();}
   else if(result.conflict)notice='Hay ventas guardadas que necesitan revisión. Consulta Ventas pendientes de sincronizar.';
   else if(result.synced)notice=result.synced===1?'Venta guardada sincronizada.':result.synced+' ventas guardadas sincronizadas.';
  });
 }
 async function confirmCheckoutOperator(description){
  const owner=identity();
  const accepted=await askCurrent('¿Confirmas que '+(actor()?.full_name||actor()?.email||'tu cuenta de Central')+' registra '+description+'?',{acceptLabel:'Confirmar operador',acceptTone:'primary'});
  if(!accepted)return false;
  if(owner!==identity()||!host||!allowed())throw Error('La sesión ha cambiado. Vuelve a abrir el ticket.');
  return {actorId:owner,accepted:true};
 }
 async function confirmPendingOperator(pending){
  const run=generation,owner=identity(),drawer=context?.drawers.find(d=>d.id===session?.drawerId);
  if(operatorSettingsStore&&drawer){const loaded=operatorSettings(await operatorSettingsStore(drawer));if(run!==generation||owner!==identity()||!host)throw Error('La sesión ha cambiado.');operatorRules=loaded;}
  if(!operatorRules.requireAtCheckout)return undefined;
  const total=pending.reduce((sum,row)=>sum+(row.totalCents??row.ticket.totalCents),0);
  return confirmCheckoutOperator(pending.length===1?'el ticket pendiente '+pending[0].id.slice(0,8)+' de '+money(total):pending.length+' tickets pendientes de esta caja por '+money(total));
 }
 function localJournal(deviceId){const drawer=context.drawers.find(row=>row.id===session.drawerId);return createOfflineJournal({scope:{actorId:identity(),connectionId:drawer.connectionId,storeId:session.storeId,shopId:drawer.shopId,drawerId:session.drawerId,deviceId}});}
 async function recover(operationId){incidentForm=false;
  const resultGeneration=generation,resultActor=identity(),resultSession=session?.id;
  if(live()&&session&&adapter.offlineDelivery){
   const recoveryGeneration=generation,recoveryActor=identity(),recoverySession=session.id;
   const deviceId=offlineDevice(storage),journal=localJournal(deviceId),saved=await journal.get(operationId);
   if(recoveryGeneration!==generation||recoveryActor!==identity()||recoverySession!==session?.id||!host)throw Error('La sesión ha cambiado. Vuelve a abrir sus ventas pendientes.');
   guard();
   if(saved&&saved.status!=='synced'){
    if(saved.ticket.cashSessionId!==session.id)throw Error('Esta venta pertenece a otra sesión de caja. Abre su caja original para recuperarla.');
    if(globalThis.navigator?.onLine===false){
     lines=[];payment=null;tab='sale';
     receipt={id:operationId,status:'uncertain',reference:'Ticket '+operationId.slice(0,8),totalCents:saved.ticket.totalCents,
      localQueued:saved.status==='queued',needsReview:saved.status==='conflict',
      changeCents:saved.ticket.payments.filter(row=>row.method==='cash').reduce((sum,row)=>sum+(row.receivedCents??row.amountCents)-row.amountCents,0)};
     notice=saved.status==='conflict'?'La venta necesita revisión. Conecta para comprobar su resultado.':'La venta está guardada. La sincronización continuará cuando vuelva la conexión.';
     return;
    }
    const acknowledgement=saved.ticket.operatorAcknowledgement?undefined:await confirmPendingOperator([saved]);
    if(acknowledgement===false)return;
    const run=generation,owner=identity(),cashSession=session.id,delivery=await adapter.offlineDelivery({deviceId,authorizeAction:({kind,operationId,totalCents})=>confirmSensitive(kind,operationId,totalCents),...(acknowledgement?{operatorAcknowledgement:acknowledgement}:{})});
    const sync=createOfflineSync({journal,adapter:delivery,isCurrent:()=>run===generation&&owner===identity()&&allowed()&&!!host&&session?.id===cashSession});
    const checked=await sync.synchronize(operationId);
    if(checked.status==='conflict'){receipt={...receipt,id:operationId,status:'uncertain',localQueued:false,needsReview:true,totalCents:saved.ticket.totalCents};throw Error('El cálculo o los datos de esta venta necesitan revisión. Conserva el ticket y no vuelvas a cobrarlo.');}
    if(checked.status!=='synced'){lines=[];payment=null;tab='sale';receipt={id:operationId,status:'uncertain',totalCents:saved.ticket.totalCents};notice='La venta sigue guardada en este dispositivo. Recupera su resultado cuando vuelva la conexión.';return;}
   }
  }
  const observed=await adapter.recover({operationId});
  if(resultGeneration!==generation||resultActor!==identity()||resultSession!==session?.id||!host)throw Error('La sesión ha cambiado. Vuelve a abrir sus ventas pendientes.');
  guard();lines=[];payment=null;tab='sale';
  if(observed.status==='ready'&&observed.payment){if(observed.payment.quoteExpiresAt<=Date.now()){
    await adapter.discardQuote(operationId);receipt=null;notice='El cálculo anterior ha caducado sin crear un pedido. Ya puedes preparar otra venta.';await reloadProducts();return;}
   payment=observed.payment;receipt=null;paymentValues={};draftInfo=observed.draft||null;}else{receipt=observed;if(observed.status==='confirmed'){
    draftInfo=null;delete formValues.ticket;delete formValues.pay;paymentValues={};formDirty=Object.keys(formValues).length>0;notice='';return;
   }}await reloadProducts();}
 async function addProduct(p){if(p.offlineUnavailable)throw Error('Este artículo aún no tiene precio y existencias guardados para trabajar sin conexión.');if(!canSellProduct(p,stockRules))throw Error('Este artículo está desactivado en la web. Revisa la opción de venta de desactivados en Configuración del TPV.');const existing=lines.find(l=>l.productId===p.id),run=generation,owner=identity();let increment=existing?1:(p.minimumQty||1);
  if(displayOptions.requireQuantity){const min=existing?1:(p.minimumQty||1),max=Math.min(10000,canExceedStock(p,stockRules)?10000:p.stock)-(existing?.qty||0);if(max<min)throw Error('No hay unidades suficientes para añadir este artículo.');increment=await quantityPicker.choose({name:p.name,min,max});if(increment===null)return false;
   if(run!==generation||owner!==identity()||!host)return false;guard();if(!canSell()||payment||receipt)throw Error('La venta ya no está disponible.');}
  const quantity=(existing?.qty||0)+increment;
  if(quantity>p.stock&&!canExceedStock(p,stockRules)||quantity>10000)throw new Error('No hay unidades suficientes para añadir este artículo.');
  if(existing){existing.temporaryLineNames=p.temporaryLineNames===true;existing.unitPriceOverride=p.unitPriceOverride===true;existing.allowOutOfStock=p.allowOutOfStock===true;existing.stock=p.stock;existing.qty=quantity;if(displayOptions.ticketNewestFirst){lines.splice(lines.indexOf(existing),1);lines.push(existing);}}
  else lines.push({productId:p.id,name:p.name,originalName:p.name,temporaryLineNames:p.temporaryLineNames===true,qty:quantity,unitCents:p.priceCents,stock:p.stock,allowOutOfStock:p.allowOutOfStock===true,minimumQty:p.minimumQty||1,unitPriceOverride:p.unitPriceOverride===true});
  if(displayOptions.beepOnAdd)playAddFeedback();
  if(live())void refreshBasketPrices();
  if(displayOptions.returnToStart){const run=generation,operator=identity();searchRevision++;clearTimeout(searchTimer);search='';if(initialCategoryId&&!visibleCategories(false).some(c=>c.id===initialCategoryId))initialCategoryId=0;categoryId=initialCategoryId;productPage=0;variantProduct=0;variantGroupId=0;catalogueSort=parentCatalogueSort||catalogueSort;parentCatalogueSort=null;
   try{await reloadProducts();}catch(error){if(run!==generation||operator!==identity()||!allowed())throw error;
    products=[];notice='Artículo añadido. No se ha podido cargar la categoría inicial. Vuelve a seleccionarla para reintentar.';}}return true;}
 function playAddFeedback(){try{const Audio=globalThis.AudioContext||globalThis.webkitAudioContext;if(!Audio)return;
  audioFeedback??=new Audio();const context=audioFeedback;
  void context.resume().then(()=>{if(context!==audioFeedback||context.state!=='running')return;
   const tone=context.createOscillator(),gain=context.createGain();tone.frequency.value=880;gain.gain.setValueAtTime(.035,context.currentTime);
   gain.gain.exponentialRampToValueAtTime(.001,context.currentTime+.07);tone.connect(gain);gain.connect(context.destination);
   tone.start();tone.stop(context.currentTime+.08);tone.onended=()=>{tone.disconnect();gain.disconnect();};}).catch(()=>{});
 }catch{/* A denied audio device never blocks an added article or a sale. */}}
 async function keydown(event){if(event.key!=='Enter'||!event.target.matches('[data-tpv-search]')||!host||!allowed()||mountedActor!==identity()||
  !['sale','stock','inventory'].includes(tab)||tab==='sale'&&(payment||receipt||!canSell())||tab==='stock'&&!canReceiveStock()||tab==='inventory'&&!canInventory())return;
  event.preventDefault();clearTimeout(searchTimer);searchRevision++;const value=event.target.value.trim();if(!value)return;
  scanQueue.push({value,tab,generation});event.target.value='';if(!busy&&!scanning)await drainScans();
 }
 async function drainScans(){if(scanning||busy)return;scanning=true;const run=generation;
  try{while(scanQueue.length&&run===generation){const scan=scanQueue.shift();if(scan.generation!==generation||scan.tab!==tab)continue;
  search=scan.value;
  await work(async()=>{products=await adapter.searchProducts({sessionId:session.id,search:scan.value,searchFields:searchOptions.fields,catalogueFilters:currentCatalogueFilters(),...inventoryCatalogueQuery()});const p=products[0],query=scan.value.toLocaleLowerCase('es');
   if(products.length===1&&!products.hasMore&&!p.chooseVariant&&searchOptions.fields.filter(key=>key!=='name').some(key=>{const value=({reference:p.reference,ean13:p.barcode,upc:p.upc,isbn:p.isbn})[key];return value&&String(value).toLocaleLowerCase('es')===query;})){
    if(tab==='stock'){stockIntake.add(p);notice='Unidad añadida a la entrada de mercancía.';}else if(tab==='inventory'){const previous=inventoryPanel.snapshot().find(r=>r.id===p.id);inventoryPanel.count(p,String((previous?.count||0)+1));notice='Unidad añadida al recuento de inventario.';}else notice=await addProduct(p)?'Artículo añadido al ticket.':'Selección de cantidad cancelada.';
   }else notice=products.length?'Selecciona el artículo y su variante entre las coincidencias.':'No hay artículos con ese código.';
  });
  }
  }finally{if(run===generation)scanning=false;}
  if(run===generation){const next=host?.querySelector('[data-tpv-search]');next?.focus();}
 }
 async function click(event){
  if(!event.target.closest('.tpv-actions'))host?.querySelector('.tpv-actions[open]')?.removeAttribute('open');
  const target=event.target.closest('button');if(!target||!host?.contains(target)||busy)return;
  if(!allowed()||mountedActor!==identity()){const root=host;dispose();root.innerHTML='<p role="alert">La sesión ha cambiado. Vuelve a entrar en TotusTPV.</p>';return;}
  const action=target.dataset.tpvAction;
  if(central()&&target.dataset.creditSale)return work(()=>creditCollections.choose(target.dataset.creditSale));
  if(central()&&target.dataset.creditAction)return work(()=>creditCollections.action(target.dataset.creditAction));
  if((generalSetup.isOpen()||receiptSetup.isOpen()||(cashSetup.isOpen()||paymentSetup.isOpen()||permissionsSetup.isOpen()||Object.values(ownedSetups).some(panel=>panel.isOpen())))&&(action||target.dataset.tpvReferenceSection)){const panel=[generalSetup,receiptSetup,cashSetup,paymentSetup,permissionsSetup,...Object.values(ownedSetups)].find(panel=>panel.isOpen());if(!await panel.requestLeave())return;}
  if(settingsDrawerId&&['sale','reference-actions','history','session','stock','inventory','reports','drafts','budgets','exit','change-operator','show-workstation','barcodes','new-product','new-customer','customer-display','offline-pending','online-orders','order-notices','live','practice','central-appearance'].includes(action)){await work(restoreSaleSettings);if(settingsDrawerId)return;}
  if(action==='assign'&&generalSetupInvoke&&canAssign()){if(hasDraft())throw Error('Guarda o termina la edición antes de configurar la caja.');return cashSetup.open(host);}
  if(action==='entry-settings'&&generalSetupInvoke&&canAssign())return work(async()=>{if(!adapter||!context){await openLive(false);if(!adapter||!context){adapter=bindAdapter(createLiveAdapter());context=discoverWorkstations(await adapter.context(),await generalSetupInvoke('totus_tpv_general_setup_context',{}),identity());}}workstationOpen=false;referenceSection='General';tab='settings';notice='';});
  if(action==='general-setup'&&generalSetupInvoke&&canAssign()){if(hasDraft()&&!await askCurrent('¿Guardar o terminar el ticket antes de configurar General?',{acceptLabel:'Volver al ticket'}))return;if(hasDraft())return;return generalSetup.open(host);}
  const noticeAction=target.dataset.tpvOrderNotice;
  if(noticeAction&&live()){
   if(noticeAction==='refresh')return orderWatch.refresh();
   const id=Number(target.dataset.orderId);if(!Number.isSafeInteger(id)||id<=0)return;
   if(noticeAction==='print'){
    const row=orderWatch.snapshot().jobs.find(row=>row.orderId===id);if(!row)return;
    if(row.status!=='pending'&&!await askCurrent('Puede existir una copia de este pedido. ¿Solicitar otra impresión?',{acceptLabel:'Reimprimir copia'}))return;
    return orderWatch.requestPrint(id);
   }
   if(noticeAction==='view')return work(async()=>{if(!receiptStyle.showOnlineTickets)throw Error('Activa el ticket de pedidos online en Ticket antes de abrirlo.');const run=generation,owner=identity(),source=adapter,document=await source.webReceipt(id);if(run!==generation||owner!==identity()||source!==adapter)return;if(document?.external_order!==true||document.order_id!==id)throw Error('El ticket no corresponde al pedido seleccionado.');documentPreview=document;tab='order-notices';});
  }
  if(action==='order-notices'&&live())return work(async()=>{if(returnForm)throw Error('Termina o cancela la devolución antes de abrir los avisos.');tab='order-notices';});
  if(action==='show-workstation'&&central())return work(async()=>{if(hasDraft())throw Error('Termina o aparca el ticket y guarda los cambios antes de cambiar de puesto.');context=await adapter.context();if(canAssign()&&generalSetupInvoke){const available=await generalSetupInvoke('totus_tpv_general_setup_context',{});context=discoverWorkstations(context,available,identity());}workstationStore=session?.storeId||selectedStore||context.stores[0]?.id;workstationDrawer=session?.drawerId||selectedDrawer||context.drawers.find(row=>row.storeId===workstationStore)?.id;workstationOpen=true;});
  if(action==='show-workstation'){workstationStore=session?.storeId||selectedStore||context.stores[0]?.id;workstationDrawer=session?.drawerId||selectedDrawer||context.drawers.find(row=>row.storeId===workstationStore)?.id;workstationOpen=true;render();return;}
  if(action==='close-workstation'){workstationOpen=false;render();return;}
  if(target.dataset.tpvPickStore&&(!session||central())){const store=context.stores.find(row=>row.id===target.dataset.tpvPickStore);if(!store)return;workstationStore=store.id;workstationDrawer=context.drawers.find(row=>row.storeId===store.id)?.id||'';render();return;}
  if(target.dataset.tpvPickDrawer&&(!session||central())){const drawer=context.drawers.find(row=>row.id===target.dataset.tpvPickDrawer&&row.storeId===workstationStore);if(!drawer)return;workstationDrawer=drawer.id;render();return;}
  if(action==='prepare-workstation'&&central()&&canAssign()&&generalSetupInvoke){const drawer=context.drawers.find(d=>d.id===workstationDrawer&&d.storeId===workstationStore&&d.requiresSetup);if(!drawer)return;workstationOpen=false;centralSettingsDrawerId=drawer.id;referenceSection='Permisos';tab='settings';render();return;}
  if(action==='apply-workstation'&&(!session||central())){if(!context.drawers.some(row=>row.id===workstationDrawer&&row.storeId===workstationStore))return;workstationOpen=false;return changeWorkstation(workstationStore,workstationDrawer);}
  if(action==='workstation-cash'){workstationOpen=false;return work(()=>changeTab('session'));}
  if(action==='workstation-user'){workstationOpen=false;render();const change=host.querySelector('[data-tpv-action=change-operator]');if(change)change.click();return;}
  if(action==='change-operator'&&onChangeOperator)return work(async()=>{
   if((live()||central())&&!operatorRules.switchEnabled)throw Error('El cambio de operador está desactivado en esta caja.');
   if(hasDraft())throw Error('Antes de cambiar de operador, termina o aparca el ticket y guarda o cancela los cambios pendientes. Los cobros enviados deben recuperarse antes de salir.');
   const choicesReader=central()?adapter?.operatorChoices:readOperatorChoices;
   if(choicesReader){
    const run=generation,owner=identity(),drawer=(live()||central())?context?.drawers.find(d=>d.id===(session?.drawerId||selectedDrawer)):undefined;let items=[],unavailable=false,enabled=true;
    try{const data=await choicesReader(drawer);if(run!==generation||owner!==identity()||!host)return;guard();const availability=operatorAvailability(data,owner);items=availability.items.filter(row=>row.operatorId!==owner);enabled=availability.enabled;}catch{if(run!==generation||owner!==identity()||!host)return;if(central())throw Error('No se han podido comprobar los operadores de esta caja. Tu sesión sigue abierta.');unavailable=true;}
    if(!enabled){operatorRules={...operatorRules,switchEnabled:false};throw Error('El cambio de operador está desactivado en este puesto. Una persona autorizada puede revisarlo en Configuración.');}
    let selected=await operatorPicker.choose({items,unavailable});if(!selected||run!==generation||owner!==identity()||!host)return;
    if(!unavailable){
     let data;try{data=await choicesReader(drawer);}catch{throw Error('No se ha podido volver a comprobar el operador. Inténtalo de nuevo.');}
     if(run!==generation||owner!==identity()||!host)return;guard();const fresh=operatorAvailability(data,owner);
     if(!fresh.enabled){operatorRules={...operatorRules,switchEnabled:false};throw Error('El cambio de operador está desactivado en este puesto. Una persona autorizada puede revisarlo en Configuración.');}
     if(selected.operatorId){const verified=fresh.items.find(r=>r.operatorId===selected.operatorId&&r.loginEmail===selected.loginEmail);if(!verified)throw Error('El acceso de esa persona ha cambiado. Vuelve a elegir un operador.');selected=verified;}
    }
    const verified=await verifyOperatorHandoff(selected);if(verified===false)return;guard();await onChangeOperator(verified);return;
   }
   if(!await askCurrent('Se cerrará tu sesión de Central en este equipo. La caja seguirá abierta y la siguiente persona entrará con su propia cuenta y sus permisos. ¿Cambiar de operador?',{acceptLabel:'Cerrar sesión y cambiar'}))return;
   const verified=await verifyOperatorHandoff();if(verified===false)return;guard();await onChangeOperator(verified);
  });
  if(action==='refresh-sensitive-settings'&&live()&&settingsSource().actionPolicy)return work(async()=>{sensitiveRules=sensitiveSettings(await settingsSource().actionPolicy());delete formValues['sensitive-settings'];formDirty=Object.keys(formValues).length>0;notice='Confirmaciones de cuenta actualizadas.';});
  if(['customer-add-extra','customer-remove-extra'].includes(action))return work(()=>editCustomerExtras(target,action));
  if(action==='refresh-customer-settings'&&live()&&customerSettingsStore)return work(async()=>{
   if(formValues['customer-settings']&&!await askCurrent('¿Descartar los cambios de clientes?',{acceptLabel:'Volver a consultar'}))return;
   const run=generation,owner=identity(),drawer=context.drawers.find(d=>d.id===(settingsDrawerId||session?.drawerId||selectedDrawer)),observed=await readCustomerRules(drawer);
   if(run!==generation||owner!==identity()||!host||drawer.id!==(settingsDrawerId||session?.drawerId||selectedDrawer))return;
   customerRules=observed;delete formValues['customer-settings'];formDirty=Object.keys(formValues).length>0;notice='Configuración de clientes actualizada.';
  });
  if(action==='refresh-budget-settings'&&live()&&budgetSettingsStore)return work(async()=>{if(formValues['budget-settings']&&!await askCurrent('¿Descartar los cambios de presupuestos?',{acceptLabel:'Volver a consultar'}))return;const drawer=context.drawers.find(d=>d.id===(settingsDrawerId||session?.drawerId||selectedDrawer));budgetRules=await readBudgetRules(drawer);delete formValues['budget-settings'];formDirty=Object.keys(formValues).length>0;notice='Configuración de presupuestos actualizada.';});
  if(action==='refresh-operator-auth'&&live()&&settingsSource().operatorSwitchPolicy)return work(async()=>{if(formValues['operator-auth-settings']&&!await askCurrent('¿Descartar los cambios de contraseña del cambio de operador?',{acceptLabel:'Volver a consultar'}))return;operatorAuthRules=operatorSwitchPolicy(await settingsSource().operatorSwitchPolicy());delete formValues['operator-auth-settings'];formDirty=Object.keys(formValues).length>0;notice='Confirmación del cambio de operador actualizada.';});
  if(action==='refresh-operator-settings'&&live()&&operatorSettingsStore)return work(async()=>{
   if(formValues['operator-settings']&&!await askCurrent('¿Descartar los cambios de operadores sin guardar?',{acceptLabel:'Volver a consultar'}))return;
   const run=generation,owner=identity(),drawer=context.drawers.find(d=>d.id===(settingsDrawerId||session?.drawerId||selectedDrawer));const observed=operatorSettings(await operatorSettingsStore(drawer));
   if(run!==generation||owner!==identity()||!host)return;operatorRules=observed;delete formValues['operator-settings'];formDirty=Object.keys(formValues).length>0;notice='Configuración de operadores actualizada.';
  });
  if(action==='offline-recheck'&&live())return work(()=>offlinePanel.recheck(target.dataset.tpvOfflineId));
  if(action==='offline-pending'&&live())return work(async()=>{if(payment&&receipt?.status!=='uncertain'||returnForm)throw Error('Termina la operación actual antes de consultar las ventas pendientes.');reports.reset();await offlinePanel.open();tab='offline-pending';});
  if(action==='offline-sync'&&live())return work(()=>offlinePanel.synchronize());
  if(target.dataset.tpvBarcode)return barcodePanel.click(target);
  if(action==='barcodes'&&live())return work(async()=>{if(payment||returnForm)throw Error('Termina el cobro o la devolución antes de abrir los códigos.');barcodePanel.reset();await barcodePanel.load();tab='barcodes';});
  if(target.dataset.tpvLineTax)return work(async()=>{
   const line=lines.find(row=>row.productId===target.dataset.tpvLineTax),run=generation,owner=identity(),drawer=context?.drawers.find(row=>row.id===session?.drawerId);
   if(!(live()||central())||!line||payment||returnForm||!canSell()||!catalogueTaxChange||!canEditProductTax()||!taxRules.allowTaxChanges||!drawer)throw Error('No tienes acceso al cambio de impuesto de este producto.');
   const productId=String(line.productId).split(':')[0],review=central()?await adapter.reviewCatalogueTax(productId):await catalogueTaxChange.review(drawer,productId);
   if(run!==generation||owner!==identity()||!host)return;
   const selected=await taxGroupPicker.choose(review,line.originalName||line.name);
   if(selected===null||run!==generation||owner!==identity()||!host)return;guard();
   if(payment||returnForm||!lines.includes(line)||!canEditProductTax()||!taxRules.allowTaxChanges)throw Error('El ticket o los permisos han cambiado.');
   const result=central()?await adapter.applyCatalogueTax({review,rate:selected}):await catalogueTaxChange.apply(drawer,review,selected);
   if(run!==generation||owner!==identity()||!host)return;
   if(result.verified!==true)throw Error('No se ha confirmado el cambio de impuesto.');
   if(adapter.invalidateCatalogueProduct)await adapter.invalidateCatalogueProduct(productId);
   basketPriceRevision++;basketPreview=null;clearTimeout(basketPriceTimer);for(const row of lines){if(central()){const saved=result.rows?.find(item=>item.id===row.productId);if(saved){row.unitCents=saved.priceCents;row.pricePending=false;}}else row.pricePending=true;}
   await reloadProducts();notice='Impuesto del producto guardado y releído. El importe de la venta se comprobará antes del cobro.';
  });
  if(target.dataset.tpvLineName)return work(async()=>{const line=lines.find(line=>line.productId===target.dataset.tpvLineName),run=generation,owner=identity();if(!line||payment||!canSell())return;
   const answer=await lineNameEditor.choose({name:line.name,originalName:line.originalName||line.name,canRename:can('edit')&&priceRules.allowNameChanges&&(central()||line.temporaryLineNames===true)});
   if(answer===null||run!==generation||owner!==identity()||!host)return;guard();if(!canSell()||payment||!lines.includes(line))throw Error('El ticket ya no está disponible.');
   if(answer!==''&&(!can('edit')||!priceRules.allowNameChanges||!(central()||line.temporaryLineNames)))throw Error('La edición del nombre no está disponible. Puedes restaurar el nombre del catálogo.');
   line.customName=lineName(answer);line.name=line.customName??line.originalName??line.name;});
  if(action==='new-product'||action==='product-history')return work(async()=>{
   if(action==='new-product'&&(!session||payment||returnForm||receipt?.status==='uncertain'))throw Error('Termina o recupera el cobro o la devolución antes de crear un producto.');
   if(!session){const storeId=host.querySelector('[data-tpv-store]').value,drawerId=host.querySelector('[data-tpv-drawer]').value;await adapter.selectWorkstation({storeId,drawerId});}
   await productIntake.open();
  });
  if(Object.keys(target.dataset).some(key=>key.startsWith('tpvProduct')||key==='tpvCategoryId'))return work(async()=>{
   await productIntake.click(target);if(!productIntake.isOpen()&&session)await reloadProducts();
  });
  if(action==='customer-display'){try{customerScreen.open();failure='';}catch(error){failure=error.message;}render();return;}
  if(target.hasAttribute('data-tpv-access-batch-open'))return work(async()=>{
   if((accessPanel.hasDraft()||formValues.configure)&&!await askCurrent('¿Descartar los cambios sin guardar?',{acceptLabel:'Descartar cambios'}))return;
   accessBatch.open(configuration);delete formValues.configure;formDirty=Object.keys(formValues).length>0;
  });
  if(target.hasAttribute('data-tpv-batch-back'))return work(()=>accessBatch.back());
  if(target.hasAttribute('data-tpv-batch-close'))return work(async()=>{
   if(accessBatch.hasDraft()&&!accessBatch.hasPending()&&!await askCurrent('¿Descartar los cambios de este bloque sin guardar?',{acceptLabel:'Descartar cambios'}))return;
   accessBatch.close();
  });
  if(target.hasAttribute('data-tpv-batch-save')||target.hasAttribute('data-tpv-batch-recover'))return work(async()=>{
   try{
    if(target.hasAttribute('data-tpv-batch-save'))await accessBatch.save();else await accessBatch.recover();
    notice='Bloque de accesos guardado y comprobado. El historial y las cajas abiertas se conservan.';
   }finally{
    if(accessBatch.affectsActor(identity())&&live()){adapter=null;context=null;session=null;products=[];tab='sale';reports.reset();customers.reset();}
   }
   configuration=await readConfiguration({connectionId:configuration?.connectionId||null});accessPanel.load(configuration);
  });
  if(target.hasAttribute('data-tpv-access-edit')||target.hasAttribute('data-tpv-access-cancel')||target.hasAttribute('data-tpv-access-refresh'))return work(async()=>{
   if(!canAssign())throw Error('No tienes permiso para gestionar los accesos.');
   if((accessPanel.hasDraft()||formValues.configure)&&!await askCurrent('¿Descartar los cambios sin guardar?',{acceptLabel:'Descartar cambios'}))return;
   if(target.hasAttribute('data-tpv-access-refresh')){configuration=await readConfiguration({connectionId:configuration?.connectionId||null});accessPanel.load(configuration);}
   else if(target.hasAttribute('data-tpv-access-edit'))accessPanel.edit(Number(target.dataset.tpvAccessEdit));
   else accessPanel.cancel();
   delete formValues.configure;formDirty=Object.keys(formValues).length>0;
  });
  if(catalogueTable.click(target))return;
  if(target.hasAttribute('data-tpv-columns-save'))return work(async()=>{
   const columns=catalogueTable.draft();if(live()){if(!workspacePreferences)throw Error('No se puede guardar la distribución.');
    const drawer=context.drawers.find(d=>d.id===(session?.drawerId||selectedDrawer));const saved=await workspacePreferences(drawer,{columns});
    if(JSON.stringify(saved.columns)!==JSON.stringify(columns))throw Error('No se ha confirmado la distribución guardada.');}
   catalogueTable.setColumns(columns);notice=live()?'Columnas guardadas en tu cuenta.':'Columnas de práctica aplicadas.';});
  if(target.dataset.tpvSort)return work(async()=>{
   const next={field:target.dataset.tpvSort,direction:catalogueSort.field===target.dataset.tpvSort&&catalogueSort.direction==='asc'?'desc':'asc'};
   await reloadProducts({sortField:next.field,sortDirection:next.direction,page:0});catalogueSort=next;productPage=0;scheduleCatalogueRefresh();
   if(!variantProduct&&live()&&workspacePreferences){const drawer=context.drawers.find(d=>d.id===(session?.drawerId||selectedDrawer));await workspacePreferences(drawer,{sortField:next.field,sortDirection:next.direction});}
  });
  if(action==='show-products'||action==='show-ticket'){mobilePane=action==='show-products'?'catalogue':'ticket';render();return;}
  if(action==='online-orders'&&onOnlineOrders&&canOnlineOrders()){
   event.stopPropagation();const run=generation,owner=identity();try{if(document.fullscreenElement===host)await document.exitFullscreen();if(run!==generation||owner!==identity()||!host||!allowed())return;await onOnlineOrders();}catch(error){if(run===generation&&owner===identity()){failure=error.message||'No se han podido abrir los avisos de pedidos.';render();}}return;
  }
  if(action==='fullscreen'){if(document.fullscreenElement===host)void document.exitFullscreen();else void host.requestFullscreen?.().catch(()=>{failure='No se pudo abrir la pantalla completa. Puedes seguir trabajando en esta ventana.';render();});return;}
  if(target.hasAttribute('data-tpv-stock-labels'))return work(()=>stockIntake.prepareLabels());
  if(target.hasAttribute('data-tpv-stock-label-print'))return work(()=>stockIntake.printLabels());
  if(target.hasAttribute('data-tpv-stock-refresh'))return work(()=>stockIntake.load());
  if(target.dataset.tpvStockReceipt)return work(()=>stockIntake.select(target.dataset.tpvStockReceipt));
  if(target.dataset.tpvStockRun)return work(async()=>{await stockIntake.run(target.dataset.tpvStockRun);await reloadProducts();notice='Entrada de mercancía verificada.';});
  if(target.dataset.tpvStockCancel)return work(()=>stockIntake.cancel(target.dataset.tpvStockCancel));
  if(target.dataset.tpvStockRemove){if(canReceiveStock()){stockIntake.remove(target.dataset.tpvStockRemove);render();}return;}
  if(target.dataset.tpvReportAction==='central'&&live()&&onCash&&canCentralCash())return work(async()=>{
   if(hasDraft())throw Error('Aparca o termina el ticket y los cambios pendientes antes de abrir Cajas.');
   const drawer=context?.drawers.find(row=>row.id===(session?.drawerId||selectedDrawer)),sessionId=reports.selectedSession();
   if(!drawer?.connectionId||!drawer.shopId||!sessionId)throw Error('Selecciona el informe de caja antes de abrirlo en Central.');
   await onCash({connectionId:drawer.connectionId,shopId:drawer.shopId,sessionId});
  });
  if(target.dataset.tpvReportAction)return work(()=>{reports.click(target);if(target.dataset.tpvReportAction==='close')tab='sale';});
  if(action==='reports'&&live())return work(async()=>{if(customers.hasDraft())throw Error('Termina o descarta la edición del cliente antes de consultar informes.');
   customers.reset();tab='reports';if(!session){const storeId=host.querySelector('[data-tpv-store]').value,
   drawerId=host.querySelector('[data-tpv-drawer]').value;await adapter.selectWorkstation({storeId,drawerId});}await reports.open();});
  if(action==='budgets'&&live())return work(async()=>{
   if(customers.hasDraft())throw Error('Termina o descarta la edición del cliente antes de consultar presupuestos.');
   customers.reset();if(!session){const storeId=host.querySelector('[data-tpv-store]')?.value,drawerId=host.querySelector('[data-tpv-drawer]')?.value;await adapter.selectWorkstation({storeId,drawerId});}
   budgetEditing=false;selectedBudget=null;tab='budgets';await loadBudgets();
  });
  if(action==='save-budget'&&live()&&canSell()&&lines.length&&!payment)return work(async()=>{budgetPending=await adapter.pendingBudget?.()===true;budgetEditing=true;selectedBudget=null;tab='budgets';});
  if(action==='budget-back'){budgetEditing=false;delete formValues.budget;tab='sale';render();return;}
  if(action==='budget-refresh'){budgetQuery=host.querySelector('[data-tpv-budget-query]')?.value.trim()||'';return work(async()=>{selectedBudget=null;await loadBudgets();});}
  if(action==='budget-more')return work(()=>loadBudgets(true));
  if(action==='budget-recover')return work(async()=>{selectedBudget=await adapter.recoverBudgetPreparation();budgetEditing=false;delete formValues.budget;formDirty=Object.keys(formValues).length>0;await loadBudgets();notice='Presupuesto recuperado. El ticket que tengas abierto se conserva.';});
  if(target.dataset.tpvBudgetId)return work(async()=>{selectedBudget=await adapter.getBudget(target.dataset.tpvBudgetId);budgetEditing=false;});
  if(action==='budget-print'&&selectedBudget){const run=generation,owner=identity();printTpvMarkup(budgetDocumentHtml(selectedBudget),'TotusTPV · '+selectedBudget.reference,{current:()=>run===generation&&owner===identity()&&!!host&&allowed()});return;}
  if(action==='budget-convert'&&selectedBudget)return work(async()=>{
   if(!session||!canSell())throw Error('Abre una caja con permiso de venta antes de convertir el presupuesto.');
   if(lines.length||draftInfo||payment||returnForm||receipt?.status==='uncertain')throw Error('Aparca o descarta el ticket actual antes de abrir el presupuesto.');
   if(!await askCurrent('¿Abrir este presupuesto como ticket? Antes del cobro se comprobarán los precios, descuentos y existencias actuales.',{acceptLabel:'Abrir ticket'}))return;
   const restored=await adapter.openBudget({id:selectedBudget.id,version:selectedBudget.version});
   if(restored.checkoutId){await recover(restored.checkoutId);return;}
   lines=restored.lines;draftInfo=restored.draft;selectedCustomer=restored.customer;customers.reset();
   formValues.ticket={draftLabel:restored.draft.label,discountKind:restored.adjustment?.kind||'',discountValue:restored.adjustment?(restored.adjustment.value/100).toFixed(2).replace('.',','):'',coupon:restored.coupon||'',note:restored.note||''};
   receipt=null;tab='sale';notice='Presupuesto '+restored.budget.reference+' abierto. Revisa el cálculo antes de cobrar.';await reloadProducts();
  });
  if(action==='budget-cancel'&&selectedBudget&&can('edit'))return work(async()=>{
   if(!await askCurrent('¿Anular este presupuesto? Su documento se conservará para consulta.',{acceptLabel:'Anular presupuesto'}))return;
   selectedBudget=await adapter.cancelBudget({id:selectedBudget.id,version:selectedBudget.version});await loadBudgets();notice='Presupuesto anulado. Su documento se conserva.';
  });
  if(action==='refresh-drafts')return work(async()=>{parked=await adapter.drafts();});
  if(target.dataset.tpvDraftId)return work(async()=>{const row=parked.find(row=>row.id===target.dataset.tpvDraftId);if(!canSell()||!row)throw Error('Necesitas permiso de venta para recuperar este ticket.');if(parkingExpiry(row).expired)throw Error('Este ticket ha caducado. Se conserva para consulta y archivo.');if(lines.length||payment||returnForm||customers.hasDraft())throw new Error('Aparca o descarta el ticket actual antes de recuperar otro.');
   const restored=await adapter.claimDraft({draftId:target.dataset.tpvDraftId});lines=restored.lines;draftInfo=restored.draft;selectedCustomer=restored.customer;customers.reset();
   formValues.ticket={draftLabel:restored.draft.label,discountKind:restored.adjustment?.kind||'',
    discountValue:restored.adjustment?(restored.adjustment.value/100).toFixed(2).replace('.',','):'',coupon:restored.coupon||'',note:restored.note||''};
   receipt=null;tab='sale';notice='Ticket recuperado. Revisa precios e importes antes de cobrar.';await reloadProducts();});
  if(target.dataset.tpvArchiveDraft)return work(async()=>{const row=parked.find(row=>row.id===target.dataset.tpvArchiveDraft);if(!row||!await askCurrent('¿Archivar este ticket sin vender? Su historial se conserva.',{acceptLabel:'Archivar ticket'}))return;
   await adapter.archiveDraft({draftId:row.id,version:row.version});parked=await adapter.drafts();});
  if(Object.keys(target.dataset).some(key=>key.startsWith('tpvClient')))return work(()=>customers.click(target));
  if(action==='new-customer'&&live()&&!payment&&canCustomer('view')&&canCustomer('create'))return work(async()=>{await customers.open();await customers.click({dataset:{tpvClientAction:'new'}});});
  if(action==='inventory-save')return work(async()=>{for(const input of host.querySelectorAll('[data-tpv-inventory-count]'))if(!input.checkValidity())throw Error('Corrige las cantidades no válidas antes de guardar.');inventoryPanel.save();notice='Recuento guardado en este equipo; las existencias no se han modificado.';});
  if(action==='inventory-apply')return work(async()=>{
   if(!live()||!canInventory()||!applyInventory)throw Error('Selecciona una caja conectada con permiso de inventario.');
   for(const input of host.querySelectorAll('[data-tpv-inventory-count]'))if(!input.checkValidity())throw Error('Corrige las cantidades del inventario.');
   const drawer=context.drawers.find(r=>r.id===session?.drawerId),rows=inventoryPanel.snapshot();
   if(!drawer||!rows.length)throw Error('Selecciona la caja y cuenta los artículos.');
   if(!await askCurrent('¿Aplicar el recuento a las existencias de esta tienda? Se comprobará cada artículo antes de guardarlo.',{acceptLabel:'Aplicar inventario'}))return;
   const run=generation,owner=identity();inventoryPanel.save();
   const result=await applyInventory({...drawer,inventoryId:inventoryPanel.inventoryId()},rows);
   if(run!==generation||owner!==identity()||!host||session?.drawerId!==drawer.id)throw Error('La sesión ha cambiado. Recupera el inventario para comprobar su resultado.');
   if(result?.verified!==true)throw Error('El inventario no ha quedado confirmado.');
   inventoryPanel.complete();await reloadProducts();notice='Inventario aplicado y verificado: '+result.items+' artículos, '+result.adjusted+' ajustes.';
  });
  if(action==='inventory-new')return work(async()=>{inventoryPanel.newCount();await reloadProducts();notice='Nuevo recuento iniciado.';});
  if(action==='inventory-export'){if(!canInventory())return;const blob=new Blob([inventoryPanel.csv()],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='inventario.csv';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);return;}
  if(target.dataset.tpvInventoryVariants)return work(async()=>{const p=products.find(r=>r.id===target.dataset.tpvInventoryVariants);if(!p?.chooseVariant||!canInventory())return;variantProduct=p.nativeProductId;productPage=0;await reloadProducts();});
  if(action==='customers'&&central()&&!payment&&canCustomer('view'))return work(async()=>{const selected=await chooseNativeCustomer({adapter,current:()=>!!host&&allowed()&&central()});if(selected!==undefined){selectedCustomer=selected;await reloadProducts();}});
  if(action==='customers'&&live()&&!payment&&canCustomer('view'))return work(()=>customers.open());
  if(target.dataset.tpvBilling&&live()&&onBilling&&canBilling())return work(async()=>{
   if(hasDraft())throw Error('Aparca o termina el ticket y los cambios pendientes antes de abrir Facturación.');
   const drawer=context?.drawers.find(row=>row.id===(session?.drawerId||selectedDrawer));
   if(!drawer?.connectionId||!drawer.shopId)throw Error('Selecciona el establecimiento de esta venta antes de abrir su factura.');
   await onBilling({saleId:target.dataset.tpvBilling,connectionId:drawer.connectionId,shopId:drawer.shopId});
  });
  if(target.dataset.tpvSignatureSale&&live()&&typeof adapter.findInvoiceSignature==='function')return work(async()=>{
   if(payment||returnForm)throw Error('Termina el cobro o la devolución actual antes de abrir la firma.');
   tab='signature';await signaturePanel.open(target.dataset.tpvSignatureSale);
  });
  if(action==='signature-close'){
   if(signaturePanel.hasDraft()&&!await askCurrent('¿Volver a los documentos? La solicitud pendiente seguirá disponible para recuperar su resultado. La firma que todavía no se haya guardado tendrá que recogerse de nuevo.'))return;
   signaturePanel.reset();tab='history';render();return;
  }
  if(['signature-capture','signature-save','signature-recover','signature-cancel','signature-original','signature-download'].includes(action)&&signaturePanel.isOpen())return work(async()=>{
   if(action==='signature-capture')await signaturePanel.collect();
   else if(action==='signature-save')await signaturePanel.submit();
   else if(action==='signature-recover')await signaturePanel.recover();
   else if(action==='signature-cancel'){await signaturePanel.cancel();tab='history';}
   else await signaturePanel.download(action==='signature-original'?'original':'signed');
  });
  if(action==='web-orders'&&live()&&receiptStyle.showOnlineTickets&&typeof adapter.webOrders==='function')return work(async()=>{if(returnForm)throw Error('Termina o cancela la devolución actual antes de consultar otros pedidos.');const run=generation,owner=identity(),scope=JSON.stringify([selectedStore,selectedDrawer,session?.id]);history=[];documentPreview=null;webHistory=true;tab='history';const rows=await adapter.webOrders({});if(run!==generation||owner!==identity()||!host||scope!==JSON.stringify([selectedStore,selectedDrawer,session?.id]))return;history=rows;orderLookup='';notice='Historial: últimos 100 pedidos de la web de esta tienda. Sus tickets no registran nuevos cobros en caja.';});
  if(target.dataset.tpvWebReceipt&&live())return work(async()=>{if(!receiptStyle.showOnlineTickets)throw Error('Activa los tickets de pedidos web en Configuración.');documentPreview=null;const run=generation,owner=identity(),scope=JSON.stringify([selectedStore,selectedDrawer,session?.id]),document=await adapter.webReceipt(Number(target.dataset.tpvWebReceipt));if(run!==generation||owner!==identity()||!allowed()||!host||scope!==JSON.stringify([selectedStore,selectedDrawer,session?.id]))return;documentPreview=document;});
  if(target.dataset.tpvDocument&&(live()||central()))return work(async()=>{const run=generation,owner=identity(),documentScope=JSON.stringify([session?.id,session?.storeId,session?.drawerId,selectedStore,selectedDrawer]),current=()=>run===generation&&owner===identity()&&allowed()&&!!host&&documentScope===JSON.stringify([session?.id,session?.storeId,session?.drawerId,selectedStore,selectedDrawer]);
   const doc=target.dataset.tpvDocument==='gift'?await loadGiftReceipt({getDocument:args=>adapter.document(args),saleId:target.dataset.saleId,options:effectiveReceiptStyle(),current}):await adapter.document({saleId:target.dataset.saleId,kind:target.dataset.tpvDocument,refundId:target.dataset.refundId});
   if(!current())return;
   if(doc.mime==='application/pdf'){await downloadNativePdf(doc);const number=receiptNumber(doc.ticket_number);notice=number?.kind==='return'?'Devolución '+number.label+' · abono nativo descargado.':'Documento nativo descargado.';}else {nativeReceiptHtml(doc,effectiveReceiptStyle());documentPreview=doc;}});
  if(action==='close-document'){documentPreview=null;render();return;}
  if(action==='print-document'&&documentPreview&&tab==='order-notices'){const id=documentPreview.order_id,row=orderWatch.snapshot().jobs.find(row=>row.orderId===id);if(!row)return;if(row.status!=='pending'&&!await askCurrent('Puede existir una copia de este pedido. ¿Solicitar otra impresión?',{acceptLabel:'Reimprimir copia'}))return;return orderWatch.requestPrint(id);}
  if(action==='print-document'&&documentPreview){if(documentPreview.external_order&&!receiptStyle.showOnlineTickets){failure='Los tickets de pedidos web están desactivados.';documentPreview=null;render();return;}const run=generation,operator=identity();printReceipt(documentPreview,effectiveReceiptStyle(),{current:()=>run===generation&&operator===identity()&&allowed()});return;}
  if(['return-all','return-clear'].includes(action)&&returnForm&&!returnForm.prepared){
   if(!canSell()||busy)return;
   const form=host.querySelector('[data-tpv-form="refund"]');if(!form)return;
   for(const line of returnForm.lines){const field=form.elements.namedItem('qty-'+line.productId);if(field)field.value=String(action==='return-all'?line.remainingQty:0);}
   rememberForm(form);return;
  }
  if(action==='register-target'&&canAssign()&&readConfiguration&&configureWorkstation)return work(async()=>{
   if(configuration?.mode!=='register-target')throw Error('Vuelve a seleccionar la web que quieres preparar.');
   const selected=configuration,run=generation,owner=identity();
   if(!await askCurrent('¿Preparar '+selected.origin+' para configurar TotusTPV? Este paso no realiza ventas.',{acceptLabel:'Preparar esta web'}))return;
   if(configuration!==selected||run!==generation||owner!==identity()||!canAssign())throw Error('La selección ha cambiado. Vuelve a comprobar la web.');
   await configureWorkstation({action:'register-target',selection:{connectionId:selected.connectionId},revision:selected.revision,confirmed:true});
   guard();if(configuration!==selected||run!==generation||owner!==identity())throw Error('La selección ha cambiado. Actualiza la configuración.');
   configuration=await readConfiguration({connectionId:selected.connectionId});accessPanel.load(configuration);configurationId=crypto.randomUUID();
   notice='Web preparada. Configura ahora la tienda, la caja y sus usuarios.';
  });
  if(action==='assign'&&canAssign()&&readConfiguration)return work(async()=>{
   if(lines.length||payment||returnForm||customers.hasDraft()||stockIntake.hasDraft()||productIntake.hasDraft()||accessPanel.hasDraft()||accessBatch.hasDraft())throw Error('Aparca o termina el ticket y la edición actual antes de configurar el puesto.');
   configuration=await readConfiguration({connectionId:settingsDrawer()?.connectionId||configuration?.connectionId||null});accessPanel.load(configuration);configurationId=crypto.randomUUID();if(adapter&&context&&!(tab==='settings'&&['Permisos','Caja'].includes(referenceSection)))tab='configuration';});
  if(action==='refresh-configuration'&&canAssign()&&readConfiguration){
   const form=host.querySelector('[data-tpv-form="configure"]');if(form)rememberForm(form);
   return work(async()=>{
   const updated=await readConfiguration({connectionId:configuration?.connectionId||null});
   if(configuration.mode!=='connect-website'&&(updated.connectionId!==configuration.connectionId||updated.revision!==configuration.revision))throw Error('La conexión ha cambiado. Cancela esta preparación y vuelve a seleccionar el puesto.');
   if(formValues.configure){
    const selected=formValues.configure;
    if(!updated.stores.some(row=>row.id===selected.store)){selected.store=updated.stores[0]?.id||'';delete selected.drawer;}
    if(!updated.drawers.some(row=>row.id===selected.drawer&&row.store_id===selected.store))delete selected.drawer;
    if(!updated.operators.some(row=>row.id===selected.operator))delete selected.operator;
   }
   configuration=updated;accessPanel.load(configuration);notice='Tiendas y cajas actualizadas. Revisa la selección antes de asignar el puesto.';
  });}
  if(action==='cancel-configuration'){configuration=null;configurationId=null;delete formValues.configure;tab='sale';render();return;}
  if(target.dataset.tpvStock)return work(async()=>{const p=products.find(p=>p.id===target.dataset.tpvStock);if(!p)return;
   if(p.chooseVariant){parentCatalogueSort={...catalogueSort};catalogueSort=variantOrder(displayOptions.variantOrder);variantProductName=p.name;variantGroupId=0;if(!variantView)variantView=window.matchMedia('(max-width:600px)').matches?'grid':'table';variantProduct=p.nativeProductId;productPage=0;products=[];await reloadProducts();}else stockIntake.add(p);});
  if(target.hasAttribute('data-tpv-tender')||target.hasAttribute('data-tpv-tender-exact')){
   if(!payment||!canSell())return;const form=host.querySelector('[data-tpv-form="pay"]');if(!form||!['cash','mixed'].includes(form.elements.method.value))return;
   try{const value=target.hasAttribute('data-tpv-tender')?Number(target.dataset.tpvTender):form.elements.method.value==='mixed'?inputCents(form.elements.cashPart.value):payment.totalCents;
    if(!Number.isSafeInteger(value)||value<0)throw new Error('Importe no válido.');
    clearCashCount(form,'received');form.elements.received.value=(value/100).toFixed(2).replace('.',',');rememberForm(form);reflectTender();
   }catch{reflectTender();}return;
  }
  if(target.dataset.tpvAdd){if(!canSell()||payment||receipt)return;const p=products.find(p=>p.id===target.dataset.tpvAdd);
   if(!p)return;if(p.chooseVariant)return work(async()=>{parentCatalogueSort={...catalogueSort};catalogueSort=variantOrder(displayOptions.variantOrder);variantProductName=p.name;variantGroupId=0;if(!variantView)variantView=window.matchMedia('(max-width:600px)').matches?'grid':'table';variantProduct=p.nativeProductId;productPage=0;products=[];await reloadProducts();});
   return work(async()=>{if(!await addProduct(p))return;if(variantProduct){variantProduct=0;variantGroupId=0;catalogueSort=parentCatalogueSort||catalogueSort;parentCatalogueSort=null;productPage=0;try{await reloadProducts();}catch{products=[];notice='Variante añadida. Actualiza el catálogo para continuar.';}}});}
  if(target.dataset.tpvRemove){if(payment||!canSell())return;lines=lines.filter(l=>l.productId!==target.dataset.tpvRemove);render();if(live())void refreshBasketPrices();return;}
  if(target.dataset.tpvRecover)return work(()=>recover(target.dataset.tpvRecover));
  if(target.dataset.tpvReturn)return work(async()=>{if(!session||!canSell())throw new Error('Necesitas una caja abierta y permiso de venta para devolver.');
   returnForm={...await adapter.returnable({sessionId:session.id,saleId:target.dataset.tpvReturn}),operationId:crypto.randomUUID()};delete formValues.refund;});
  if(target.dataset.tpvRefundRecover)return work(async()=>{const result=await adapter.recoverRefund(target.dataset.tpvRefundRecover);
   if(result.status==='confirmed'){notice='Devolución verificada: '+money(result.totalCents);history=await adapter.history();return;}
   returnForm={reference:'Devolución pendiente',operationId:result.id,prepared:result};});
  if(action==='cancel-return')return work(async()=>{if((live()||central())&&returnForm?.prepared){if(returnForm.prepared.status!=='ready')throw new Error('Recupera la devolución pendiente antes de continuar.');await adapter.cancelRefund(returnForm.operationId);}
   returnForm=null;delete formValues.refund;formDirty=Object.keys(formValues).length>0;});
  if(action==='confirm-refund'||action==='recover-refund')return work(async()=>{if(action==='confirm-refund'&&!canSell())throw Error('No tienes permiso para confirmar devoluciones.');
   const approvalId=action==='confirm-refund'?await confirmSensitive('refund',returnForm.operationId,returnForm.prepared.totalCents):undefined;if(approvalId===false)return;
   const result=action==='confirm-refund'?await adapter.submitRefund({operationId:returnForm.operationId,totalCents:returnForm.prepared.totalCents,refundConfirmed:true,...(approvalId?{approvalId}:{})}):await adapter.recoverRefund(returnForm.operationId);
   if(result.status!=='confirmed'){returnForm.prepared={...returnForm.prepared,...result};return;}
   notice='Devolución verificada: '+money(result.totalCents);returnForm=null;delete formValues.refund;formDirty=Object.keys(formValues).length>0;history=await adapter.history();await reloadProducts();});
  if(['catalogue-previous','catalogue-next','back-products'].includes(action))return work(async()=>{
   if(action==='back-products'){variantProduct=0;variantGroupId=0;catalogueSort=parentCatalogueSort||catalogueSort;parentCatalogueSort=null;productPage=0;}else productPage=Math.max(0,productPage+(action==='catalogue-next'?1:-1));await reloadProducts();});
  if(action==='configure'&&onConfigure&&canConfigure())return work(()=>onConfigure());
  if(action==='refresh-workstation'&&live())return work(()=>openLive(true));
  if(action==='setup'&&readSetup)return work(async()=>{const run=generation;setup=null;render();let observed;
   try{observed=await readSetup();}catch(error){if(/^TPV_SETUP_/.test(error?.message||''))throw new Error('No se ha podido comprobar el puesto con la sesión y configuración actuales. Vuelve a intentarlo.');throw error;}
   if(run!==generation||!host)return;guard();
   if(observed?.mode!=='setup-read-only'||observed.checkoutEnabled!==false||!Array.isArray(observed.websites))throw new Error('No se ha podido comprobar la configuración del puesto.');
   setup=observed;});
  if(action==='practice')return work(async()=>{
   setup=null;notice='';
   adapter=bindPractice();context=await adapter.context();await ticketBranding.open(context.drawers[0],false);context.stores.sort((a,b)=>a.name.localeCompare(b.name,'es',{numeric:true}));context.drawers.sort((a,b)=>a.name.localeCompare(b.name,'es',{numeric:true}));
   categories=adapter.categories?await adapter.categories():[];categoryId=visibleCategories().some(row=>row.id===initialCategoryId)?initialCategoryId:0;session=context.sessions.find(s=>s.status==='open')||null;if(session)await reloadProducts();
  });
  if(action==='central-appearance'&&onAppearance&&canAppearance())return work(()=>onAppearance());
  if(action==='ticket-logo-remove')return work(async()=>{ticketBranding.remove();});
  if(action==='reference-clear-categories'){formValues['reference-preferences']={...formValues['reference-preferences'],'CFG-10-02':[]};formDirty=true;render();return;}
  if(target.dataset.tpvReferenceSection){referenceSection=target.dataset.tpvReferenceSection;tab='settings';
   if(live()&&['Permisos','Caja'].includes(referenceSection)&&canAssign()&&readConfiguration&&!configuration)return work(async()=>{const current=settingsDrawer();configuration=await readConfiguration({connectionId:current?.connectionId||null});accessPanel.load(configuration);configurationId=crypto.randomUUID();});
   render();return;}
  if(target.dataset.tpvQuickMethod){quickPaymentMethod=target.dataset.tpvQuickMethod;render();return;}
  if(action==='settings'){if(payment||returnForm){notice='Termina la operación actual antes de configurar el mostrador.';render();return;}return work(async()=>{if(!live()&&!ticketBranding.hasDraft())await ticketBranding.open(settingsDrawer()||context.drawers[0],false);tab='settings';});}
  if(action==='credits'&&central()&&canCustomer('view'))return work(async()=>{creditScope={generation,owner:identity(),drawer:session?.drawerId||selectedDrawer};tab='credits';await creditCollections.load();});
  if(action==='reference-actions'){tab='reference-actions';render();return;}
  if(target.dataset.tpvReferenceCategory)return work(async()=>{categoryId=Number(target.dataset.tpvReferenceCategory);productPage=0;variantProduct=0;products=[];await reloadProducts();});
  if(action==='settings-functional'&&!live()){notice='Los ajustes conectados se abrirán al seleccionar una tienda. Esta vista no realiza cambios reales.';render();return;}
  if(action==='settings-functional'&&live())return work(async()=>{if(customers.hasDraft()||returnForm||payment)throw Error('Termina la operación actual antes de configurar el mostrador.');barcodePanel.reset();tab='settings-functional';});
  if(action==='live'&&createLiveAdapter)return work(()=>openLive(true));
  if(action==='add-menu-link'){
   const row=host.querySelector('.tpv-menu-link-row[hidden]');if(row){row.hidden=false;row.querySelector('input')?.focus();}
   target.hidden=!host.querySelector('.tpv-menu-link-row[hidden]');return;
  }
  if(action==='remove-menu-link'){
   const row=target.closest('.tpv-menu-link-row'),form=row?.closest('form');if(!row||!form)return;
   const inputs=[...row.querySelectorAll('input')],changed=inputs.some(input=>input.value);for(const input of inputs)input.value='';row.hidden=true;
   if(!form.querySelector('.tpv-menu-link-row:not([hidden])'))form.querySelector('.tpv-menu-link-row').hidden=false;
   form.querySelector('[data-tpv-action="add-menu-link"]').hidden=false;if(changed)rememberForm(form);return;
  }
  if(action==='exit'){if(!await requestLeave())return;orderWatch.stop();operatorRules={switchEnabled:true,revision:0,requireAtCheckout:false};accessBatch.reset();barcodePanel.reset();adapter=null;context=null;session=null;lines=[];payment=null;receipt=null;returnForm=null;formValues={};formDirty=false;selectedCustomer=null;customers.reset();reports.reset();stockIntake.reset();inventoryPanel.reset();productIntake.reset();draftInfo=null;parked=[];render();return;}
  if(['sale','history','session','stock','drafts','inventory'].includes(action))return work(()=>changeTab(action));
  if(action==='park')return work(async()=>{if(!parkingRules.enabled)throw Error('El aparcado está desactivado para tu cuenta y esta caja. Puedes consultar los tickets anteriores desde Más acciones.');if(!(live()||central()&&adapter?.park)||!canSell()||!lines.length||payment||returnForm)throw new Error('Termina el cobro o la devolución antes de aparcar otro ticket.');
   const {adjustment,coupon,note}=ticketAdjustments(),label=formValues.ticket?.draftLabel?.trim()||draftInfo?.label||'Ticket '+new Date().toLocaleString('es-ES');
   await adapter.park({label,lines:copyLines().map(line=>({...line,name:lines.find(l=>l.productId===line.productId).name,originalName:lines.find(l=>l.productId===line.productId).originalName})),adjustment,coupon,note});
   lines=[];draftInfo=null;selectedCustomer=null;customers.reset();await adapter.setCustomer(null);delete formValues.ticket;formDirty=Object.keys(formValues).length>0;
   tab='drafts';parked=await adapter.drafts();notice='Ticket aparcado. No se ha creado una venta ni reservado existencias.';});
  if(action==='payment'){
   const invalid=host.querySelector('[data-tpv-quantity]:invalid');if(invalid){invalid.reportValidity();return;}
   return work(async()=>{if(!canSell())throw new Error('No tienes permiso para crear ventas.');
   if(central()){
    const run=generation,operator=identity(),scopeSession=session.id;
    const payments=await adapter.paymentOptions(),policy=await adapter.commercialPolicy();
    const outcome=await openCentralCheckoutDialog({beforeSubmit:confirmCentralCheckout,adapter:()=>adapter,isCurrent:()=>run===generation&&operator===identity()&&!!host&&allowed()&&canSell()&&session?.id===scopeSession,scope:{initialMethod:quickPaymentMethod,showTaxBreakdown:displayOptions.showTaxBreakdown,sessionId:scopeSession,lines:copyLines(),customer:selectedCustomer,canCustomers:canCustomer('view'),methods:payments.options.enabledMethods,labels:payments.options.labels,allowMixed:checkoutStyle.allowMixed,policy}});
    if(run!==generation||operator!==identity()||!host)return;
    if(outcome){receipt=outcome;lines=[];payment=null;draftInfo=null;delete formValues.ticket;selectedCustomer=null;await adapter.setCustomer(null);notice='Venta registrada en Central.';if(adapter.document&&Number.isSafeInteger(receipt.orderId)){const delivery=await receiptDelivery.afterConfirmation({sale:receipt,options:effectiveReceiptStyle(),current:()=>run===generation&&operator===identity()&&allowed()});if(delivery?.document)documentPreview=delivery.document;if(delivery?.warning)notice=delivery.warning;}}
    return;
   }
   const {adjustment,coupon,note}=ticketAdjustments();
   if(live()&&priceRules.requireSaleNote&&!note)throw Error('Añade la nota interna antes de calcular el cobro.');
   const run=generation,operator=identity(),calculated=await adapter.quote({sessionId:session.id,lines:copyLines(),...(live()?{adjustment,coupon,note}:{})});
   if(run!==generation||operator!==identity()||!host)return;guard();if(!canSell())throw Error('Necesitas permiso de venta para continuar.');payment=calculated;
   if(live())for(const verified of payment.lines||[]){const line=lines.find(line=>line.productId===verified.productId+':'+verified.attributeId);if(line&&typeof verified.name==='string'){line.name=verified.name;if(typeof verified.catalogueName==='string')line.originalName=verified.catalogueName;}}
   const methods=allowedPaymentForms(payment.paymentMethods);paymentValues={method:methods.includes(quickPaymentMethod)?quickPaymentMethod:methods[0]};if(!methods.includes(quickPaymentMethod))notice='El medio elegido no está disponible. Revisa la forma de pago antes de confirmar.';});}
  if(action==='cancel-payment')return work(async()=>{if(live())await adapter.discardQuote(payment.id);payment=null;paymentValues={};delete formValues.pay;formDirty=Object.keys(formValues).length>0;});
  if(action==='clear')return work(async()=>{if(!canSell()||payment)return;if((lines.length||draftInfo)&&!await askCurrent(wording('¿Vaciar el ticket de práctica?',
   '¿Descartar el ticket actual? Si procede de un aparcado, quedará archivado sin borrar su historial.'),{acceptLabel:'Descartar ticket'}))return;
   if(live()||central()){await adapter.abandonDraft();await adapter.setCustomer(null);}lines=[];draftInfo=null;selectedCustomer=null;customers.reset();delete formValues.ticket;formDirty=Object.keys(formValues).length>0;await reloadProducts();});
  if(action==='review-incident'&&canAssign()){incidentForm=true;render();return;}
  if(action==='recover')return work(()=>recover(receipt.id));
  if(action==='next')return work(async()=>{if(live()&&receipt?.localQueued&&adapter.leaveLocalTicket)await adapter.leaveLocalTicket(receipt.id);mobilePane='catalogue';receipt=null;lines=[];payment=null;documentPreview=null;selectedCustomer=null;customers.reset();if(live()||central()){await adapter.setCustomer(null);await reloadProducts();}delete formValues.ticket;formDirty=Object.keys(formValues).length>0;});
 }
 async function openLive(required){
  if(settingsDrawerId){await restoreSaleSettings();if(settingsDrawerId)return false;}
  const candidate=bindAdapter(createLiveAdapter()),observed=await candidate.context();
  if(!observed.drawers?.length&&candidate.mode==='central'&&canAssign()&&generalSetupInvoke){const available=discoverWorkstations(observed,await generalSetupInvoke('totus_tpv_general_setup_context',{}),identity());if(available.drawers.length){adapter=candidate;context=available;session=null;selectedStore=workstationStore=context.drawers[0].storeId;selectedDrawer=workstationDrawer=context.drawers[0].id;workstationOpen=true;notice='Selecciona la tienda y configura el acceso a su caja para empezar.';return true;}}
  if(!observed.drawers?.length){if(required)throw Error('Todavía no tienes una caja asignada. Pide al responsable de tu tienda que te dé acceso desde Administrar tiendas y cajas.');notice='Todavía no tienes una caja asignada. En Tiendas, cajas y usuarios puedes crear tu puesto y autorizar tu acceso.';return false;}
  const visible=candidate.mode==='central'&&canAssign()&&generalSetupInvoke?discoverWorkstations(observed,await generalSetupInvoke('totus_tpv_general_setup_context',{}),identity()):observed;
  notice='';adapter=candidate;context=visible;session=context.sessions.find(s=>s.status==='open')||null;
  if(session)await adapter.selectSession(session);
  else {const drawer=observed.drawers[0];selectedStore=drawer.storeId;selectedDrawer=drawer.id;await adapter.selectWorkstation({storeId:selectedStore,drawerId:selectedDrawer});
   if(context.drawers.length>1){workstationStore=selectedStore;workstationDrawer=selectedDrawer;workstationOpen=true;}}
  await loadWorkspacePreferences();if(session){const pending=adapter.pendingSale?await adapter.pendingSale():null;
   if(pending)await recover(pending);else await reloadProducts();}setup=null;if(session)onlineSyncRequested=true;return true;
 }
 async function editCustomerExtras(target,action){
  if(!live()||!customerSettingsStore||!canAssign())throw Error('No tienes permiso para configurar los clientes.');
  const current=customerSettingsFromForm(new Map(Object.entries(formValues['customer-settings']??customerSettingsFormValues(customerRules))),customerRules),{expectedRevision,...settings}=current;
  if(action==='customer-add-extra'){
   if(settings.extraFields.length>=20)throw Error('Puedes configurar hasta veinte campos adicionales.');
   settings.extraFields.push({id:crypto.randomUUID(),label:'Nuevo campo',target:'customer',type:'text',required:false,options:[]});
  }else{
   if(!settings.extraFields.some(f=>f.id===target.dataset.customerExtraId))throw Error('Vuelve a consultar el campo adicional.');
   if(!await askCurrent('¿Quitar este campo de los formularios?',{acceptLabel:'Quitar campo'}))return;
   settings.extraFields=settings.extraFields.filter(f=>f.id!==target.dataset.customerExtraId);
  }
  formValues['customer-settings']=customerSettingsFormValues({...settings,revision:expectedRevision});formDirty=true;
 }
 async function readCustomerRules(drawer,settings=null){try{return customerSettings(await customerSettingsStore(drawer,settings));}catch(error){throw customerSettingsError(error);}}
 async function readBudgetRules(drawer,settings=null){try{return budgetOptions(await budgetSettingsStore(drawer,settings));}catch(error){throw budgetSettingsError(error);}}
 async function loadWorkspacePreferences(){
  const run=generation,actor=identity(),source=settingsSource(),sourceContext=context,sourceDrawer=settingsDrawer()?.id;
  const current=()=>run===generation&&actor===identity()&&source===settingsSource()&&sourceContext===context&&settingsDrawer()?.id===sourceDrawer;
  const ensureCurrent=()=>{if(!current())throw Error('El puesto ha cambiado. Vuelve a abrir la caja para consultar su configuración.');};
  if(source.mode==='central'){
   const saved=await source.workspaceOptions();ensureCurrent();
   drawerPayments=await source.paymentOptions();ensureCurrent();categories=session?await source.categories():[];ensureCurrent();
   displayOptions=displayPreferences(saved.display);receiptStyle=receiptOptions(saved.receipt);cashStyle=cashOptions(saved.cash);
   priceRules=lineOptions(saved.lineOptions);parkingRules=parkingOptions(saved.parking);operatorRules=saved.operators;
   const drawer=sourceContext.drawers.find(d=>d.id===sourceDrawer);
   if(storeCheckoutRules&&drawer){const observed=await storeCheckoutRules(drawer);ensureCurrent();checkoutStyle=checkoutRules(observed.settings);}else checkoutStyle={...CHECKOUT_DEFAULTS};
   searchOptions=searchPreferences();catalogueOptions=cataloguePreferences();stockRules=stockPolicy(saved.stockPolicy);taxRules=taxPreference(saved.taxPolicy);
   catalogueView=['grid','compact','list','table'].includes(saved.viewMode)?saved.viewMode:'grid';initialCategoryId=categories.some(row=>row.id===saved.initialCategoryId)?saved.initialCategoryId:0;categoryId=initialCategoryId;productPage=0;variantProduct=0;customMenuLinks=normalizeMenuLinks(saved.menuLinks);
   customerRules=customerSettings();budgetRules=budgetOptions();signatureRules=signatureOptions();returnRules={allowPartial:true};
   nativePromotion.reset();nativeLoyalty.reset();nativeCheckout.reset();
   if(ticketBrandingStore&&drawer){await ticketBranding.open(drawer,true);ensureCurrent();}
   return;
  }
  const payments=source.paymentOptions?await source.paymentOptions():null;ensureCurrent();
  const loadedCategories=source.categories?await source.categories():[];ensureCurrent();
  const drawer=sourceContext.drawers.find(d=>d.id===sourceDrawer);
  const saved=workspacePreferences&&drawer?await workspacePreferences(drawer):null;ensureCurrent();
  if(storePromotionSetup&&canAssign()&&drawer){await nativePromotion.open(drawer);ensureCurrent();}else nativePromotion.reset();
  if(storeLoyaltySetup&&canAssign()&&drawer){await nativeLoyalty.open(drawer);ensureCurrent();}else nativeLoyalty.reset();
  if(storeCheckoutRules&&drawer){const result=await storeCheckoutRules(drawer);ensureCurrent();if(result?.drawerId!==drawer.id)throw Error('No se han verificado las opciones de cobro de la caja.');checkoutStyle=checkoutRules(result.settings);if(canAssign()){await nativeCheckout.open(drawer);ensureCurrent();}}else{checkoutStyle={...CHECKOUT_DEFAULTS};nativeCheckout.reset();}
  const loadedNumbering=receiptNumbering&&drawer?receiptSeries(await receiptNumbering(drawer)):null;ensureCurrent();
  const loadedCustomerRules=customerSettingsStore&&drawer?await readCustomerRules(drawer):customerSettings();ensureCurrent();
  const loadedBudgetRules=budgetSettingsStore&&drawer?await readBudgetRules(drawer):budgetOptions();ensureCurrent();
  const loadedLinks=menuLinksStore&&drawer?normalizeMenuLinks(await menuLinksStore(drawer)):[];ensureCurrent();
  const loadedOperatorAuth=source.operatorSwitchPolicy?operatorSwitchPolicy(await source.operatorSwitchPolicy()):operatorSwitchPolicy();ensureCurrent();
  const loadedSensitive=source.actionPolicy?sensitiveSettings(await source.actionPolicy()):sensitiveSettings();ensureCurrent();
  const loadedOperators=operatorSettingsStore&&drawer?operatorSettings(await operatorSettingsStore(drawer)):{switchEnabled:true,revision:0};ensureCurrent();
  const loadedVisibility=cashVisibilityStore&&drawer?cashVisibility(await cashVisibilityStore(drawer)):{hideSummary:false};ensureCurrent();
  const loadedReturns=returnPolicyStore&&drawer?returnPolicy(await returnPolicyStore(drawer)):{allowPartial:true};ensureCurrent();
  const loadedSignature=signaturePolicyStore&&drawer?signatureOptions(await signaturePolicyStore(drawer)):signatureOptions();ensureCurrent();
  const loadedNotices=storeOrderNotices&&drawer?orderNoticePolicy(await storeOrderNotices(drawer),drawer.id):{settings:orderNoticeOptions(),revision:0};ensureCurrent();
  const loadedBarcode=canReadCost()&&source.barcodeOptions?barcodeOptions(await source.barcodeOptions()):null;ensureCurrent();
  if(ticketBrandingStore&&drawer){await ticketBranding.open(drawer,true);ensureCurrent();}
  orderNotices=loadedNotices.settings;orderNoticeRevision=loadedNotices.revision;barcodeRules=loadedBarcode;customerRules=loadedCustomerRules;budgetRules=loadedBudgetRules;operatorRules=loadedOperators;operatorAuthRules=loadedOperatorAuth;sensitiveRules=loadedSensitive;cashVisibilityRules=loadedVisibility;signatureRules=loadedSignature;returnRules=loadedReturns;drawerPayments=payments;categories=loadedCategories;numbering=loadedNumbering;customMenuLinks=loadedLinks;
  displayOptions=displayPreferences(saved?.display);searchOptions=searchPreferences(saved?.search);includeDisabledStock=searchOptions.includeDisabledStock;catalogueOptions=cataloguePreferences(saved?.catalogue);stockRules=stockPolicy(saved?.stockPolicy);priceRules=lineOptions(saved?.lineOptions);taxRules=taxPreference(saved?.taxPolicy);parkingRules=parkingOptions(saved?.parking);
  receiptStyle=receiptOptions(saved?.receipt);
  cashStyle=cashOptions(saved?.cash);
  customerScreenOptions=customerDisplayOptions(saved?.customerDisplay);
  catalogueView=['grid','compact','list','table'].includes(saved?.viewMode)?saved.viewMode:'grid';
  catalogueTable.setColumns(saved?.columns);
  catalogueSort={field:['name','reference','stock','id','cost','manufacturer','supplier','price'].includes(saved?.sortField)?saved.sortField:'name',direction:saved?.sortDirection==='desc'?'desc':'asc'};
  if(catalogueSort.field==='cost'&&!canReadCost())catalogueSort.field='name';
  initialCategoryId=categories.some(c=>c.id===saved?.initialCategoryId)?saved.initialCategoryId:0;
  if(initialCategoryId&&!visibleCategories(false).some(row=>row.id===initialCategoryId))initialCategoryId=0;
  categoryId=initialCategoryId;productPage=0;variantProduct=0;
  if(!settingsDrawerId&&storeOrderNotices)void orderWatch.start();
 }
 const copyLines=()=>{if(lines.some(line=>line.customName)&&(!priceRules.allowNameChanges||!can('edit')))throw Error('Restaura el nombre del catálogo o activa la edición de nombres y comprueba tu permiso para editar ventas.');if(lines.some(line=>line.discountKind==='price')&&(!priceRules.allowPriceChanges||!can('edit')))throw Error('Activa el cambio de precio en Configuración y comprueba tu permiso para editar ventas.');
  return lines.map(({productId,qty,discountKind,discountValue,customName})=>{const adjustment=(live()||central())&&discountKind?{kind:discountKind,value:inputCents(discountValue)}:undefined;try{lineAdjustment(adjustment);}catch{throw Error('Escribe un precio o descuento positivo válido. El porcentaje debe ser menor del 100 %.');}return {productId,qty,...(adjustment?{discount:adjustment}:{}),...(customName?{displayName:lineName(customName)}:{})};});};
 const ticketAdjustments=()=>({adjustment:formValues.ticket?.discountKind?{kind:formValues.ticket.discountKind,value:inputCents(formValues.ticket.discountValue)}:undefined,
  coupon:formValues.ticket?.coupon?.trim()||undefined,note:saleNote(formValues.ticket?.note)});
 async function loadBudgets(more=false){
  const last=more?budgetPage.items.at(-1):null,page=await adapter.budgets({search:budgetQuery,...(last?{cursor:{createdAt:last.createdAt,id:last.id}}:{})});
  if(!Array.isArray(page?.items)||typeof page.hasMore!=='boolean')throw Error('No se ha podido consultar la lista de presupuestos.');
  budgetPage={items:more?[...new Map([...budgetPage.items,...page.items].map(row=>[row.id,row])).values()]:page.items,hasMore:page.hasMore};
  budgetPending=await adapter.pendingBudget?.()===true;
 }
 function budgetsHtml(){
  const draft=formValues.budget||{},pending=budgetPending;
  return `<section class="card card-pad tpv-budgets" aria-label="Presupuestos"><header class="inline-actions"><div><h3>Presupuestos</h3><p class="small muted">Prepara una oferta, compártela con el cliente y conviértela en venta cuando corresponda.</p></div>${button('sale','Volver al mostrador')}</header>
   ${pending?`<p class="note" role="status">Hay un guardado pendiente de confirmar. Recupera su resultado antes de preparar otro presupuesto.</p>${button('budget-recover','Recuperar presupuesto pendiente','primary')}`:''}
   ${budgetEditing?`<form data-tpv-form="budget" class="tpv-budget-editor"><h4>Guardar el ticket como presupuesto</h4><p>${lines.length} artículos · Cliente: ${esc(selectedCustomer?.name||'Cliente de mostrador')} · Estimación ${money(previewTotal())}</p><p class="small muted">El importe final del presupuesto se calculará en la tienda al guardar. Las existencias se comprobarán cuando lo conviertas en venta.</p><label>Título<input name="title" required maxlength="120" value="${esc(draft.title??'Presupuesto')}"></label><label>Vigencia en días<input name="validDays" type="number" required min="1" max="365" step="1" value="${esc(draft.validDays??30)}"></label><label>Texto para el cliente<textarea name="publicNote" maxlength="1000" rows="3" ${busy?'disabled':''}>${esc(draft.publicNote??'')}</textarea><small>Se incluirá en el documento. La nota interna del ticket se mantiene privada.</small></label><div class="inline-actions"><button type="submit" class="btn primary" ${pending?'disabled':''}>Calcular y guardar presupuesto</button>${button('budget-back','Volver al ticket')}</div></form>`:''}
   ${selectedBudget?`<section class="tpv-budget-detail"><div class="inline-actions">${button('budget-print','Imprimir presupuesto')}${['saved','checkout'].includes(selectedBudget.status)&&!selectedBudget.expired?button('budget-convert',selectedBudget.status==='checkout'?'Continuar ticket':'Abrir como ticket','primary',!session||!canSell()||!!lines.length||!!draftInfo||!!payment||!!returnForm):''}${can('edit')&&['saved','checkout'].includes(selectedBudget.status)?button('budget-cancel','Anular presupuesto'):''}</div>${!session&&['saved','checkout'].includes(selectedBudget.status)?'<p class="small muted">Para vender este presupuesto, vuelve al mostrador y abre una caja.</p>':''}${budgetDocumentHtml(selectedBudget)}</section>`:''}
   <div class="inline-actions"><label>Buscar presupuesto<input data-tpv-budget-query maxlength="120" value="${esc(budgetQuery)}" placeholder="Número o título"></label>${button('budget-refresh','Buscar y actualizar')}</div>
   <div class="tpv-history">${budgetPage.items.map(row=>`<article><div><b>${esc(row.reference)} · ${esc(row.title)}</b><small>${esc(budgetStatus(row.status))}${row.expired?' · Caducado':''} · ${esc(new Date(row.createdAt).toLocaleDateString('es-ES'))}</small></div><strong>${money(row.totalCents)}</strong><button type="button" class="btn secondary" data-tpv-budget-id="${esc(row.id)}">Ver presupuesto</button></article>`).join('')||'<p>No hay presupuestos que coincidan con esta búsqueda. Para preparar uno nuevo, añade los artículos al ticket y pulsa Guardar presupuesto.</p>'}</div>${budgetPage.hasMore?button('budget-more','Ver más presupuestos'):''}</section>`;
 }
 async function submit(event){
  if(event.target.matches('[data-credit-collection]')&&host?.contains(event.target)){event.preventDefault();if(!busy)return work(()=>creditCollections.submit(event.target));return;}
  if(event.target.matches('[data-native-checkout]')&&host?.contains(event.target)){event.preventDefault();if(!busy&&canAssign())return work(async()=>{notice=await nativeCheckout.submit(event);checkoutStyle=checkoutRules(nativeCheckout.value());});return;}
  if(event.target.matches('[data-native-promotion]')&&host?.contains(event.target)){event.preventDefault();if(!busy&&canAssign())return work(async()=>{notice=await nativePromotion.submit(event);});return;}
  if(event.target.matches('[data-native-loyalty]')&&host?.contains(event.target)){event.preventDefault();if(!busy&&canAssign())return work(async()=>{notice=await nativeLoyalty.submit(event);});return;}
  const barcodeForm=event.target.closest('[data-tpv-barcode-form]');if(barcodeForm&&host?.contains(barcodeForm)){event.preventDefault();if(!busy){guard();return barcodePanel.submit(barcodeForm);}return;}
  const batchForm=event.target.closest('[data-tpv-access-batch-form]');if(batchForm&&host?.contains(batchForm)){event.preventDefault();if(!busy)return work(()=>accessBatch.review(batchForm));return;}
  const accessForm=event.target.closest('[data-tpv-access-form]');if(accessForm&&host?.contains(accessForm)){
   event.preventDefault();if(busy)return;accessPanel.capture(accessForm);
   return work(async()=>{const changed=await accessPanel.save();
    if(changed.operatorId===identity()&&live()){adapter=null;context=null;session=null;products=[];tab='sale';reports.reset();customers.reset();}
    notice='Acceso guardado. El historial y las cajas abiertas se conservan.';
    configuration=await readConfiguration({connectionId:configuration?.connectionId||null});accessPanel.load(configuration);
   });
  }
  const lookup=event.target.closest('[data-tpv-order-search]');if(lookup&&host?.contains(lookup)){
   event.preventDefault();if(busy||!(live()||central()))return;const value=new FormData(lookup).get('orderId').trim();orderLookup=value;focusOrderLookup=true;
   return work(async()=>{if(returnForm)throw Error('Termina o cancela la devolución actual antes de buscar otro pedido.');
    const query=central()?localOrderLookupInput(value):orderLookupInput(value),run=generation,owner=identity(),scope=JSON.stringify([selectedStore,selectedDrawer,session?.id]);history=[];documentPreview=null;const rows=webHistory&&receiptStyle.showOnlineTickets?await adapter.webOrders(query):await adapter.orders(query);if(run!==generation||owner!==identity()||!host||scope!==JSON.stringify([selectedStore,selectedDrawer,session?.id]))return;history=rows;
    notice='Historial: '+(query.reference?'referencia '+query.reference:query.orderId?'pedido #'+query.orderId:'últimos 100 pedidos confirmados de todas las cajas de esta tienda')+'.';});
  }
  const customerForm=event.target.closest('[data-tpv-client-form]');if(customerForm&&host?.contains(customerForm)){
   event.preventDefault();if(!busy)return work(()=>customers.submit(customerForm));return;}
  const categoryForm=event.target.closest('[data-tpv-category-form]');if(categoryForm&&host?.contains(categoryForm)){
   event.preventDefault();if(!busy)return work(()=>productIntake.prepareCategory());return;}
  const productForm=event.target.closest('[data-tpv-product-form]');if(productForm&&host?.contains(productForm)){
   event.preventDefault();if(!busy)return work(()=>productIntake.prepare());return;}
  const form=event.target.closest('[data-tpv-form]');if(!form||!host.contains(form))return;event.preventDefault();
  if(busy)return;const formKind=form.dataset.tpvForm;
  if(!['order-notices','barcode-settings','tax-preference','reference-policy','reference-preferences','preferences','configure','receipt-series','budget-settings','customer-settings','menu-links','return-policy','signature-policy','cash-visibility','operator-settings','sensitive-settings','operator-auth-settings','payment-settings'].includes(formKind)&&!(['open','movement','close'].includes(formKind)?canManageCash():canSell()))return;
  // Capture form values before work() redraws and disables controls.
  const fields=new FormData(form),kind=form.dataset.tpvForm,storeId=host.querySelector('[data-tpv-store]')?.value,
   drawerId=host.querySelector('[data-tpv-drawer]')?.value;
  if(kind==='stock-batch')return work(async()=>{await stockIntake.save();notice='Entrada guardada. Revisa las unidades antes de registrarlas en la tienda.';});
  rememberForm(form);
  if(kind==='ticket')return;
  return work(async()=>{
   if(kind==='tax-preference'){
    const drawer=settingsDrawer(),owner=identity(),run=generation;
    if(!live()||!catalogueTaxChange||!canEditProductTax()||!workspacePreferences||!drawer)throw Error('No tienes permiso para configurar impuestos en este puesto.');
    const requested={allowTaxChanges:fields.get('allowTaxChanges')==='on'};
    const saved=await workspacePreferences(drawer,{taxPolicy:requested});guard();
    if(run!==generation||owner!==identity()||drawer!==settingsDrawer())throw Error('El puesto ha cambiado. Vuelve a consultar sus ajustes.');
    const observed=taxPreference(saved?.taxPolicy);if(observed.allowTaxChanges!==requested.allowTaxChanges)throw Error('No se ha confirmado la configuración de impuestos.');
    taxRules=observed;delete formValues['tax-preference'];formDirty=Object.keys(formValues).length>0;notice='Edición de impuestos guardada para tu cuenta y este puesto.';
   }else if(kind==='order-notices'){
    const drawer=settingsDrawer(),owner=identity(),run=generation;
    if(!live()||!storeOrderNotices||!canAssign()||!drawer)throw Error('No tienes permiso para configurar los avisos de esta caja.');
    const requested=orderNoticeOptions({enabled:fields.get('enabled')==='on',autoPrint:fields.get('autoPrint')==='on'});
    const saved=orderNoticePolicy(await storeOrderNotices(drawer,requested,orderNoticeRevision),drawer.id);guard();
    if(run!==generation||owner!==identity()||settingsDrawer()?.id!==drawer.id)throw Error('El puesto ha cambiado. Vuelve a consultar sus avisos.');
    const readback=orderNoticePolicy(await storeOrderNotices(drawer),drawer.id);guard();
    if(JSON.stringify(readback.settings)!==JSON.stringify(requested)||saved.revision!==readback.revision)throw Error('Los avisos han cambiado. Vuelve a consultar antes de guardar.');
    orderNotices=readback.settings;orderNoticeRevision=readback.revision;delete formValues['order-notices'];formDirty=Object.keys(formValues).length>0;
    notice='Avisos e impresión guardados y verificados para esta caja.';if(!settingsDrawerId)void orderWatch.start();
   }else if(kind==='barcode-settings'){if(!live()||!canStock()||settingsDrawer()?.canReconcile!==true||!settingsSource().barcodeOptions)throw Error('No tienes permiso para configurar los códigos de esta tienda.');const requested=barcodeOptionsFromForm(fields),saved=barcodeOptions(await settingsSource().barcodeOptions(requested));if(JSON.stringify(saved)!==JSON.stringify(requested))throw Error('No se ha confirmado la configuración de códigos.');barcodeRules=saved;delete formValues['barcode-settings'];formDirty=Object.keys(formValues).length>0;notice='Configuración de códigos guardada para la tienda seleccionada.';
   }else if(kind==='ticket-branding'){await ticketBranding.save();notice='Logo de la tienda guardado y comprobado.';delete formValues['ticket-branding'];formDirty=Object.keys(formValues).length>0;
   }else if(kind==='reference-policy'&&central()){
    if(!canAssign()||payment||returnForm)throw Error('Termina la operación y comprueba tu permiso para configurar este TPV.');
    if(fields.getAll('policyGroups').join(',')!=='stockPolicy')throw Error('Este ajuste no corresponde a la política de venta.');
    const requested=stockPolicyFromForm(fields,{central:true}),run=generation,owner=identity(),source=adapter,drawerId=settingsDrawerId||session?.drawerId||selectedDrawer;
    const saved=await source.workspaceOptions({stockPolicy:requested});guard();
    if(run!==generation||owner!==identity()||source!==adapter||drawerId!==(settingsDrawerId||session?.drawerId||selectedDrawer))throw Error('El puesto ha cambiado. Vuelve a consultar sus ajustes.');
    const readback=await source.workspaceOptions();guard();
    if(run!==generation||owner!==identity()||source!==adapter||drawerId!==(settingsDrawerId||session?.drawerId||selectedDrawer)||JSON.stringify(stockPolicy(saved.stockPolicy))!==JSON.stringify(requested)||JSON.stringify(stockPolicy(readback.stockPolicy))!==JSON.stringify(requested))throw Error('No se ha confirmado la política guardada. Vuelve a consultar esta caja.');
    stockRules=stockPolicy(readback.stockPolicy);delete formValues['reference-policy'];formDirty=Object.keys(formValues).length>0;notice='Política de venta del TPV guardada y comprobada. La tienda online conserva sus reglas.';
   }else if(kind==='reference-policy'){
    if(!live()||!workspacePreferences||payment||returnForm)throw Error('Termina la operación y selecciona una caja conectada.');
    const payload=referencePolicyPayload(fields,{canSell:canSell(),canEdit:can('edit')}),run=generation,owner=identity(),source=adapter,drawerId=settingsDrawerId||session?.drawerId||selectedDrawer;
    const drawer=context.drawers.find(row=>row.id===drawerId);if(!drawer)throw Error('Selecciona una caja disponible.');
    const latest=await workspacePreferences(drawer);guard();
    if(run!==generation||owner!==identity()||source!==adapter||drawerId!==(settingsDrawerId||session?.drawerId||selectedDrawer))throw Error('El puesto ha cambiado. Vuelve a consultar sus ajustes.');
    referencePolicyPayload(fields,{canSell:canSell(),canEdit:can('edit')});
    if(payload.stockPolicy?.allowOutOfStock&&cataloguePreferences(latest?.catalogue).hideUnavailable)throw Error('Desactiva Ocultar sin stock antes de permitir vender sin existencias.');
    const observed=confirmReferencePolicy(await workspacePreferences(drawer,payload),payload);guard();
    if(run!==generation||owner!==identity()||source!==adapter||drawerId!==(settingsDrawerId||session?.drawerId||selectedDrawer))throw Error('El puesto ha cambiado. Vuelve a consultar sus ajustes.');
    if(observed.lineOptions)priceRules=observed.lineOptions;if(observed.parking)parkingRules=observed.parking;if(observed.stockPolicy)stockRules=observed.stockPolicy;if(observed.cash)cashStyle=observed.cash;
    delete formValues['reference-policy'];formDirty=Object.keys(formValues).length>0;notice='Ajustes guardados para tu cuenta y esta caja.';
   }else if(kind==='reference-preferences'){
    if(payment||returnForm)throw Error('Termina el cobro o la devolución antes de cambiar los ajustes.');
    const requested=applyReferencePreferences({viewMode:catalogueView,initialCategoryId,display:displayOptions,receipt:receiptStyle,customerDisplay:customerScreenOptions,search:searchOptions,catalogue:catalogueOptions},Object.entries(formValues['reference-preferences']||{}));
    if(requested.initialCategoryId&&(!categories.some(row=>row.id===requested.initialCategoryId)||!visibleCatalogueCategories(categories,requested.catalogue.excludedCategories).some(row=>row.id===requested.initialCategoryId)))throw Error('La categoría inicial no está disponible o está oculta. Elige otra.');
    if(requested.catalogue.excludedCategories.some(id=>!categories.some(row=>row.id===id)))throw Error('Selecciona categorías disponibles en esta tienda.');
    if(stockRules.allowOutOfStock&&requested.catalogue.hideUnavailable)throw Error('Para vender sin existencias, desactiva Ocultar sin stock.');
    const run=generation,owner=identity(),source=adapter,drawerId=settingsDrawerId||session?.drawerId||selectedDrawer;
    const drawer=context.drawers.find(d=>d.id===drawerId);let observed;
    if(central()){
     const display=Object.fromEntries(['showPrices','showStock','showReferences'].map(key=>[key,requested.display[key]]));
     const unchanged=normalizeReferencePreferences({viewMode:requested.viewMode,initialCategoryId:requested.initialCategoryId,display:{...displayOptions,...display},receipt:receiptStyle,customerDisplay:customerScreenOptions,search:searchOptions,catalogue:catalogueOptions});
     if(JSON.stringify(unchanged)!==JSON.stringify(requested))throw Error('Estos otros ajustes todavía no tienen guardado en Central. Los cambios se conservan en el formulario.');
     const saved=await adapter.workspaceOptions({initialCategoryId:requested.initialCategoryId,presentation:{viewMode:requested.viewMode,display}});
     observed={...requested,initialCategoryId:saved.initialCategoryId,viewMode:saved.viewMode,display:displayPreferences(saved.display)};
     if(JSON.stringify(observed)!==JSON.stringify(requested))throw Error('No se han confirmado las opciones del catálogo guardadas.');
    }else if(live()){
     if(!workspacePreferences||!drawer)throw Error('No se puede guardar la configuración de esta caja.');
     const saved=await workspacePreferences(drawer);guard();
     if(run!==generation||owner!==identity()||source!==adapter||drawerId!==(settingsDrawerId||session?.drawerId||selectedDrawer))throw Error('El puesto ha cambiado. Vuelve a abrir su configuración.');
     const merged=applyReferencePreferences(saved||{},Object.entries(formValues['reference-preferences']||{}));
     observed=normalizeReferencePreferences(await workspacePreferences(drawer,merged));
     if(JSON.stringify(observed)!==JSON.stringify(merged))throw Error('No se han confirmado los ajustes guardados. Conserva el formulario y vuelve a intentarlo.');
    }else{
     const local=storage||globalThis.localStorage,key='totus:tpv:reference-preferences:'+identity();
     local.setItem(key,JSON.stringify(requested));observed=normalizeReferencePreferences(JSON.parse(local.getItem(key)));
     if(JSON.stringify(observed)!==JSON.stringify(requested))throw Error('No se han confirmado los ajustes de práctica.');
    }
    guard();if(run!==generation||owner!==identity()||source!==adapter||drawerId!==(settingsDrawerId||session?.drawerId||selectedDrawer))throw Error('El puesto ha cambiado. Vuelve a consultar sus ajustes.');
    const initialChanged=initialCategoryId!==observed.initialCategoryId,refreshSearch=initialChanged||JSON.stringify([searchOptions,catalogueOptions])!==JSON.stringify([observed.search,observed.catalogue]);
    catalogueView=observed.viewMode;initialCategoryId=observed.initialCategoryId;if(initialChanged)categoryId=initialCategoryId;
    displayOptions=observed.display;receiptStyle=observed.receipt;customerScreenOptions=observed.customerDisplay;searchOptions=observed.search;catalogueOptions=observed.catalogue;includeDisabledStock=searchOptions.includeDisabledStock;
    if(categoryId&&!visibleCategories(false).some(row=>row.id===categoryId))categoryId=0;
    if(session&&!settingsDrawerId&&refreshSearch){searchRevision++;clearTimeout(searchTimer);productPage=0;variantProduct=0;await reloadProducts();}
    delete formValues['reference-preferences'];formDirty=Object.keys(formValues).length>0;
    notice=central()?'Catálogo guardado y comprobado para esta caja.':live()?'Ajustes guardados en tu cuenta y esta caja.':'Ajustes de práctica guardados en este navegador.';
   }else if(kind==='budget'){
    if(!live()||!lines.length||payment)throw Error('Prepara los artículos del ticket antes de guardar el presupuesto.');
    const {adjustment,coupon,note}=ticketAdjustments();
    try{selectedBudget=await adapter.saveBudget({lines:copyLines(),adjustment,coupon,note,title:String(fields.get('title')||''),publicNote:String(fields.get('publicNote')||''),validDays:Number(fields.get('validDays'))});}
    catch(error){budgetPending=await adapter.pendingBudget?.()===true;throw error;}
    budgetEditing=false;delete formValues.budget;
    await adapter.abandonDraft();await adapter.setCustomer(null);lines=[];draftInfo=null;selectedCustomer=null;customers.reset();delete formValues.ticket;formDirty=Object.keys(formValues).length>0;
    tab='budgets';await loadBudgets();notice='Presupuesto '+selectedBudget.reference+' guardado. Puedes imprimirlo o abrirlo como ticket cuando corresponda.';return;
   }
   if(kind==='incident'){
    if(!live()||!canAssign()||fields.get('accepted')!=='on')throw Error('Revisa la incidencia antes de continuar.');
    receipt=await adapter.resolveIncident({operationId:receipt.id,reason:String(fields.get('reason')||'').trim(),settlementReview:fields.get('settlementReview')});
    incidentForm=false;payment=null;lines=[];
   }else if(kind==='customer-settings'){
    if(!live()||!customerSettingsStore||!canAssign())throw Error('No tienes permiso para configurar los clientes.');
    const run=generation,owner=identity(),drawer=context.drawers.find(d=>d.id===(settingsDrawerId||session?.drawerId||selectedDrawer)),intent=customerSettingsFromForm(fields,customerRules);
    const observed=await readCustomerRules(drawer,intent);
    if(run!==generation||owner!==identity()||!host||drawer.id!==(settingsDrawerId||session?.drawerId||selectedDrawer))throw Error('La sesión ha cambiado. Vuelve a consultar los clientes.');
    const {expectedRevision,...requested}=intent;
    if(JSON.stringify(customerSettings({...requested,revision:observed.revision}))!==JSON.stringify(observed))throw Error('No se ha confirmado la configuración de clientes. Conserva los cambios y vuelve a consultarla.');
    customerRules=observed;delete formValues['customer-settings'];formDirty=Object.keys(formValues).length>0;notice='Clientes configurados para este establecimiento.';
   }else if(kind==='budget-settings'){
    if(!live()||!budgetSettingsStore||!canAssign())throw Error('No tienes permiso para configurar los presupuestos.');
    const drawer=context.drawers.find(d=>d.id===(settingsDrawerId||session?.drawerId||selectedDrawer));
    budgetRules=await readBudgetRules(drawer,budgetOptionsFromForm(fields,budgetRules));
    delete formValues['budget-settings'];formDirty=Object.keys(formValues).length>0;notice='Presupuestos configurados para este establecimiento.';
   }else if(kind==='receipt-series'){
    if(!live()||!receiptNumbering||!can('edit'))throw Error('No tienes permiso para cambiar la numeración.');
    const drawer=context.drawers.find(d=>d.id===(settingsDrawerId||session?.drawerId||selectedDrawer));
    try{numbering=receiptSeries(await receiptNumbering(drawer,receiptSeriesFromForm(fields)));}catch(error){throw receiptSeriesError(error);}notice='Numeración guardada para este establecimiento.';
   }else if(kind==='signature-policy'){
    if(!live()||!signaturePolicyStore||!canSignatureSettings())throw Error('No tienes permiso para cambiar la firma de facturas.');
    const run=generation,owner=identity(),drawer=context.drawers.find(d=>d.id===(settingsDrawerId||session?.drawerId||selectedDrawer)),settings=signatureOptionsFromForm(fields);
    const observed=signatureOptions(await signaturePolicyStore(drawer,settings));
    if(run!==generation||owner!==identity()||!host)throw Error('La sesión ha cambiado. Vuelve a consultar la configuración.');
    if(JSON.stringify(observed)!==JSON.stringify(settings))throw Error('No se ha confirmado la configuración de firma. Conserva el formulario y vuelve a consultarla.');
    signatureRules=observed;notice='Configuración de firma guardada para esta caja.';
   }else if(kind==='operator-auth-settings'){
    if(!live()||!settingsSource().operatorSwitchPolicy||!canAssign())throw Error('No tienes permiso para configurar el cambio de operador.');
    const source=settingsSource(),run=generation,owner=identity(),drawerId=settingsDrawerId||session?.drawerId||selectedDrawer;
    const observed=await saveOperatorSwitchPolicy({current:operatorAuthRules,requested:fields.get('requireBeforeSwitch')==='on',save:settings=>source.operatorSwitchPolicy(settings),isCurrent:()=>!!host&&run===generation&&owner===identity()&&source===settingsSource()&&drawerId===(settingsDrawerId||session?.drawerId||selectedDrawer)&&canAssign()});
    operatorAuthRules=observed;
    delete formValues['operator-auth-settings'];formDirty=Object.keys(formValues).length>0;notice='Contraseña del cambio de operador guardada para esta caja.';
   }else if(kind==='sensitive-settings'){
    if(!live()||!settingsSource().actionPolicy||!canAssign())throw Error('No tienes permiso para configurar las confirmaciones de esta caja.');
    sensitiveRules=sensitiveSettings(await settingsSource().actionPolicy({requireRefund:fields.get('requireRefund')==='on',requirePrice:fields.get('requirePrice')==='on',expectedRevision:sensitiveRules.revision}));
    delete formValues['sensitive-settings'];formDirty=Object.keys(formValues).length>0;notice='Confirmaciones de cuenta guardadas para esta caja.';
   }else if(kind==='operator-settings'){
    if(!live()||!operatorSettingsStore||!canAssign())throw Error('No tienes permiso para configurar los operadores de esta caja.');
    const run=generation,owner=identity(),drawer=context.drawers.find(d=>d.id===(settingsDrawerId||session?.drawerId||selectedDrawer)),settings={switchEnabled:fields.get('switchEnabled')==='on',requireAtCheckout:fields.get('requireAtCheckout')==='on',expectedRevision:operatorRules.revision};
    const observed=operatorSettings(await operatorSettingsStore(drawer,settings));
    if(run!==generation||owner!==identity()||!host)throw Error('La sesión ha cambiado. Vuelve a consultar los operadores.');
    if(observed.switchEnabled!==settings.switchEnabled||observed.requireAtCheckout!==settings.requireAtCheckout)throw Error('No se ha confirmado la configuración de operadores. Vuelve a consultarla.');
    operatorRules=observed;notice=observed.switchEnabled?'Cambio de operador activado en esta caja.':'Cambio de operador desactivado en esta caja.';
   }else if(kind==='cash-visibility'){
    if(!live()||!cashVisibilityStore||!canAssign())throw Error('No tienes permiso para configurar la visibilidad de esta caja.');
    const run=generation,owner=identity(),drawer=context.drawers.find(d=>d.id===(settingsDrawerId||session?.drawerId||selectedDrawer)),settings={hideSummary:fields.get('hideSummary')==='on'};
    const observed=cashVisibility(await cashVisibilityStore(drawer,settings));
    if(run!==generation||owner!==identity()||!host)throw Error('La sesión ha cambiado. Vuelve a consultar la configuración.');
    if(observed.hideSummary!==settings.hideSummary)throw Error('No se ha confirmado la visibilidad de los importes. Vuelve a consultar la caja.');
    cashVisibilityRules=observed;summary=null;reports.reset();notice='Visibilidad de importes guardada para esta caja.';
   }else if(kind==='return-policy'){
    if(!live()||!returnPolicyStore||!canReturnPolicy())throw Error('No tienes permiso para cambiar las devoluciones.');
    const run=generation,owner=identity(),drawer=context.drawers.find(d=>d.id===(settingsDrawerId||session?.drawerId||selectedDrawer)),settings={allowPartial:fields.get('allowPartial')==='on',requireOriginalPayment:fields.get('requireOriginalPayment')==='on'};
    const observed=returnPolicy(await returnPolicyStore(drawer,settings));
    if(run!==generation||owner!==identity()||!host)throw Error('La sesión ha cambiado. Vuelve a consultar la configuración.');
    if(observed.allowPartial!==settings.allowPartial||observed.requireOriginalPayment!==settings.requireOriginalPayment)throw Error('No se ha confirmado la regla de devoluciones. Conserva el formulario y vuelve a consultarla.');
    returnRules=observed;notice='Configuración de devoluciones guardada para esta caja.';
   }else if(kind==='menu-links'){
    if(!live()||!menuLinksStore)throw Error('No se pueden guardar los accesos de este puesto.');
    const run=generation,owner=identity(),drawer=context.drawers.find(d=>d.id===(settingsDrawerId||session?.drawerId||selectedDrawer)),links=menuLinksFromForm(fields);
    const observed=normalizeMenuLinks(await menuLinksStore(drawer,links));
    if(run!==generation||owner!==identity()||!host)throw Error('La sesión ha cambiado. Vuelve a consultar los accesos del puesto.');
    if(JSON.stringify(observed)!==JSON.stringify(links))throw Error('No se han confirmado los accesos guardados. Conserva el formulario y vuelve a consultarlos.');
    customMenuLinks=observed;notice='Accesos guardados para tu cuenta y esta caja.';
   }else if(kind==='preferences'){
    if(!workspacePreferences)throw Error('No se puede guardar la configuración del mostrador.');
    const viewMode=fields.get('viewMode'),initial=Number(fields.get('initialCategoryId'));
    if(!['grid','compact','list','table'].includes(viewMode)||initial!==0&&!categories.some(c=>c.id===initial))throw Error('Selecciona una categoría disponible.');
    const drawer=context.drawers.find(d=>d.id===(settingsDrawerId||session?.drawerId||selectedDrawer));
    const display=displayPreferencesFromForm(fields);
    const receipt=receiptOptionsFromForm(fields);
    const customerDisplay=customerDisplayOptionsFromForm(fields);
    const searchChoice=searchPreferencesFromForm(fields),catalogueChoice=cataloguePreferencesFromForm(fields);
    if(catalogueChoice.excludedCategories.some(id=>!categories.some(row=>row.id===id)))throw Error('Elige categorías disponibles en esta tienda.');
    if(initial&&!visibleCatalogueCategories(categories,catalogueChoice.excludedCategories).some(row=>row.id===initial))throw Error('La categoría inicial está oculta. Elige otra o Todas las categorías.');
    const rules=canSell()?stockPolicyFromForm(fields):stockRules,prices=can('edit')?lineOptionsFromForm(fields):priceRules,parking=canSell()?parkingOptionsFromForm(fields):parkingRules;
    if(rules.allowOutOfStock&&catalogueChoice.hideUnavailable)throw Error('Para seleccionar artículos sin existencias, desactiva Ocultar artículos y variantes agotados.');
    const cash=cashOptionsFromForm(fields),persisted=await workspacePreferences(drawer,{viewMode,initialCategoryId:initial,display,receipt,customerDisplay,cash,search:searchChoice,catalogue:catalogueChoice,...(canSell()?{stockPolicy:rules,parking}:{}),...(can('edit')?{lineOptions:prices}:{})});
    if(JSON.stringify(stockPolicy(persisted.stockPolicy))!==JSON.stringify(rules))throw Error('No se ha confirmado la regla de existencias. Vuelve a consultar la configuración.');
    if(JSON.stringify(lineOptions(persisted.lineOptions))!==JSON.stringify(prices))throw Error('No se ha confirmado la regla de precios. Vuelve a consultar la configuración.');
    if(JSON.stringify(parkingOptions(persisted.parking))!==JSON.stringify(parking))throw Error('No se ha confirmado la configuración de tickets aparcados. Vuelve a consultarla.');
    stockRules=rules;priceRules=prices;parkingRules=parking;
    if(!persisted?.cash||JSON.stringify(cashOptions(persisted.cash))!==JSON.stringify(cash))throw Error('No se han confirmado los billetes y monedas guardados. Vuelve a consultar la configuración.');
    if(JSON.stringify(searchPreferences(persisted.search))!==JSON.stringify(searchChoice))throw Error('No se ha confirmado la configuración del buscador. Vuelve a consultarla.');
    if(JSON.stringify(cataloguePreferences(persisted.catalogue))!==JSON.stringify(catalogueChoice))throw Error('No se ha confirmado la visibilidad guardada. Vuelve a consultarla.');
    if(persisted.initialCategoryId!==initial)throw Error('No se ha confirmado la categoría inicial. Vuelve a consultar la configuración.');
    const initialChanged=initialCategoryId!==initial,searchChanged=initialChanged||JSON.stringify(searchOptions.fields)!==JSON.stringify(searchChoice.fields)||catalogueOptions.hideUnavailable!==catalogueChoice.hideUnavailable||JSON.stringify(catalogueOptions.excludedCategories)!==JSON.stringify(catalogueChoice.excludedCategories);
    catalogueOptions=catalogueChoice;if(categoryId&&!visibleCategories(false).some(row=>row.id===categoryId))categoryId=0;
    searchRevision++;clearTimeout(searchTimer);searchOptions=searchChoice;includeDisabledStock=searchChoice.includeDisabledStock;receiptStyle=receipt;if(!receipt.showOnlineTickets&&webHistory){webHistory=false;history=[];}displayOptions=display;customerScreenOptions=customerDisplay;cashStyle=cash;catalogueView=viewMode;initialCategoryId=initial;if(initialChanged)categoryId=initialCategoryId;notice='Mostrador guardado en tu cuenta.';
    if(session&&searchChanged){productPage=0;variantProduct=0;products=[];
     try{await reloadProducts();}catch(error){failure='El mostrador se ha guardado. No se pudo actualizar el catálogo: '+error.message;}}
   }else if(kind==='configure'){
    if(!canAssign()||!configureWorkstation||!configuration||fields.get('accepted')!=='on')throw new Error('Revisa la configuración del puesto.');
    const result=await configureWorkstation({action:'configure',operationId:configurationId,revision:configuration.revision,
     selection:{connectionId:configuration.connectionId,shopId:Number(fields.get('shop')),drawerId:fields.get('drawer')},
     storeId:fields.get('store'),operatorId:fields.get('operator'),paymentMethods:['cash','card',...['bizum','transfer','cheque'].filter(method=>fields.get(method)==='on')],permissions:{sell:fields.get('role')==='sell',open:fields.get('cashAccess')==='on',reconcile:true},confirmQaSetup:true});
    if(result.configured!==true)throw new Error('El puesto sigue pendiente de verificación. Conserva esta solicitud para consultar su resultado.');
    configuration=null;configurationId=null;delete formValues.configure;notice='Puesto de pruebas configurado.';tab='sale';
    if(autoOpen||adapter&&context)await openLive(false);
   }else if(kind==='open'){
    const drawer=context.drawers.find(d=>d.storeId===storeId&&d.id===drawerId);if(!drawer)throw new Error('Selecciona una caja de esta tienda.');
    session=await adapter.openSession({storeId,drawerId:drawer.id,openingCents:inputCents(fields.get('opening'))});
    tab='sale';receipt=null;lines=[];selectedCustomer=null;customers.reset();if(live()||central())await loadWorkspacePreferences();await reloadProducts();notice='';
   } else if(kind==='payment-settings'){
    if(!live()||!canAssign()||!settingsSource().paymentOptions||!drawerPayments)throw Error('No tienes permiso para configurar los cobros de esta caja.');
    if(payment)throw Error('Cancela el cálculo de cobro antes de cambiar los medios de pago.');
    const settings=paymentSettingsFromForm(fields,Object.keys(drawerPayments.options.labels));
    drawerPayments=await settingsSource().paymentOptions(settings);delete formValues['payment-settings'];formDirty=Object.keys(formValues).length>0;notice='Medios de cobro guardados para esta caja.';
   } else if(kind==='pay'){
    if(!allowedPaymentForms(payment.paymentMethods).includes(fields.get('method'))||fields.get('method')==='mixed'&&!(payment.paymentMethods||['cash','card']).filter(id=>id!=='cash').includes(fields.get('externalMethod')))throw new Error('Este medio de cobro no está habilitado para esta venta.');
    const method=fields.get('method'),cash=method==='cash'?payment.totalCents:method==='mixed'?inputCents(fields.get('cashPart')):0;
    if(cash>payment.totalCents||method==='mixed'&&(cash===0||cash===payment.totalCents))throw new Error('El pago mixto necesita una parte de efectivo y otra en el segundo medio.');
    const payments=[];if(cash>0)payments.push({method:'cash',amountCents:cash,receivedCents:checkoutReceived(checkoutStyle,cash,checkoutStyle.askReceived?inputCents(fields.get('received')):cash)});
    if(method!=='cash'){const external=method==='mixed'?fields.get('externalMethod'):method,reference=referenceForTender(payment.referencePolicy,external,fields.get('reference:'+external)??undefined);
     payments.push({method:external,amountCents:payment.totalCents-cash,simulatedAccepted:fields.get('cardAccepted')==='on',...(reference===undefined?{}:{reference})});}
    const submissionGeneration=generation,operator=identity(),operationId=payment.id;
    const acknowledgement=live()&&(operatorRules.requireAtCheckout||payment.requireOperatorAtCheckout)?await confirmCheckoutOperator('esta venta de '+money(payment.totalCents)):undefined;
    if(acknowledgement===false)return;
    if(submissionGeneration!==generation||operator!==identity()||!host||!allowed())return;
    const approvalId=live()&&payment.hasPriceOverride&&!payment.localEstimate?await confirmSensitive('price',operationId,payment.totalCents):undefined;if(approvalId===false)return;
    if(submissionGeneration!==generation||operator!==identity()||!host||!allowed())return;
    const submit=()=>adapter.submit({operationId,payments,...(approvalId?{approvalId}:{}),scenario:fields.get('scenario'),...(acknowledgement?{operatorAcknowledgement:acknowledgement}:{})});
    const ticket=live()&&adapter.localSaleTicket?await adapter.localSaleTicket({operationId,payments,...(acknowledgement?{operatorAcknowledgement:acknowledgement}:{})}):null;
    let submitted;
    if(ticket){const deviceId=offlineDevice(storage),journal=localJournal(deviceId);
     submitted=await submitWithLocalReceipt({journal,operationId,ticket,submit,isOnline:()=>payment?.localEstimate!==true&&globalThis.navigator?.onLine!==false,isCurrent:()=>submissionGeneration===generation&&operator===identity()&&allowed()&&!!host&&session?.id===ticket.cashSessionId});
    }else submitted=await submit();
    if(submissionGeneration!==generation||operator!==identity()||!allowed())return;
    receipt=submitted;if(live()&&receipt.status==='uncertain')queueSyncRetry();
    if(receipt.status==='confirmed'){payment=null;lines=[];draftInfo=null;delete formValues.ticket;
     if(live()){notice=receiptStyle.showAfterSale||receiptStyle.printAfterSale?'Pedido confirmado. Preparando justificante…':'';if(notice)render();
      const delivery=await receiptDelivery.afterConfirmation({sale:receipt,options:effectiveReceiptStyle(),current:()=>submissionGeneration===generation&&operator===identity()&&allowed()});
      if(submissionGeneration!==generation||operator!==identity())return;
      if(delivery?.document)documentPreview=delivery.document;notice=delivery?.warning||'';
     }
     if(!live())await reloadProducts();}
   } else if(kind==='refund'){
    const items=returnForm.lines.map(line=>({productId:line.productId,qty:Number(fields.get('qty-'+line.productId)),
     restock:fields.get('restock-'+line.productId)==='on'})).filter(line=>line.qty>0);
    if(live()||central()){returnForm.prepared=await adapter.prepareRefund({operationId:returnForm.operationId,saleId:returnForm.saleId,items,reason:String(fields.get('reason')||'').trim(),refundMethod:fields.get('refundMethod')||'original'});delete formValues.refund;formDirty=Object.keys(formValues).length>0;return;}
    const result=await adapter.refund({operationId:returnForm.operationId,sessionId:session.id,saleId:returnForm.saleId,items,
     refundConfirmed:fields.get('refundAccepted')==='on'});
    notice=`Devolución de práctica registrada: ${result.reference} · ${money(result.totalCents)}. Sin reintegro real.`;
    returnForm=null;history=await adapter.history({sessionId:session.id});await reloadProducts();
   } else if(kind==='movement'){
    summary=await adapter.cashMovement({kind:fields.get('kind'),amountCents:inputCents(fields.get('amount')),reason:fields.get('reason')});notice='Movimiento de caja registrado.';
   } else if(kind==='close'){
    if(signaturePanel.hasDraft())throw Error('Guarda, recupera o cancela la firma actual antes de cerrar la caja.');
    if(stockIntake.hasDraft()||stockIntake.pending())throw Error('Termina, guarda o cancela la entrada de mercancía antes de cerrar la caja.');
    if(lines.length||draftInfo||payment||returnForm||customers.hasDraft()||productIntake.hasDraft())throw new Error('Termina, aparca o descarta el ticket o la devolución pendientes antes de cerrar la caja.');
    const closed=await adapter.closeSession({sessionId:session.id,countedCents:inputCents(fields.get('counted')),note:fields.get('note')||''});
    notice=closed.cashSummaryHidden?'Caja cerrada. Tu recuento ha quedado registrado; los importes del resumen siguen ocultos.':wording('Caja de práctica cerrada. Diferencia: ','Caja cerrada. Diferencia: ')+money(closed.differenceCents);selectedStore=session.storeId;selectedDrawer=session.drawerId;session=null;receipt=null;payment=null;lines=[];tab='sale';formValues={};
   }
   delete formValues[kind];formDirty=Object.keys(formValues).length>0;
  });
 }
 function reflectPaymentMethod(){const form=host?.querySelector('[data-tpv-form="pay"]');if(!form)return;
  const method=form.querySelector('[data-tpv-method]').value;
  form.querySelector('[data-tpv-cash-part]').hidden=method!=='mixed';for(const element of form.querySelectorAll('[data-tpv-received]'))element.hidden=!checkoutStyle.askReceived||!['cash','mixed'].includes(method);
  for(const input of form.querySelectorAll('[data-tpv-count="received"] input'))input.disabled=!checkoutStyle.askReceived||!['cash','mixed'].includes(method);
  form.querySelector('[data-tpv-external-method]').hidden=method!=='mixed';
  form.querySelector('[data-tpv-denominations]').hidden=!checkoutStyle.askReceived||!['cash','mixed'].includes(method);
  const external=method==='mixed'?form.elements.externalMethod.value:method;
  for(const field of form.querySelectorAll('[data-tpv-reference]')){const active=field.dataset.tpvReference===external;field.hidden=!active;field.querySelector('input').required=active&&payment.referencePolicy?.[external]==='required';}
  form.querySelector('[data-tpv-card-accept]').hidden=method==='cash';reflectTender();}
 function reflectTender(){const form=host?.querySelector('[data-tpv-form="pay"]');if(!form||!payment)return;
  const output=form.querySelector('[data-tpv-tender-preview]'),confirm=form.querySelector('button[type="submit"]');
  try{const method=form.elements.method.value,cash=method==='cash'?payment.totalCents:method==='mixed'?inputCents(form.elements.cashPart.value):0;
   if(method==='mixed'&&(cash===0||cash>=payment.totalCents))throw new Error('Indica la parte en efectivo; el resto se registra en el segundo medio.');
   const tender=cashTenderPreview({totalCents:payment.totalCents,cashPartCents:cash,receivedCents:checkoutReceived(checkoutStyle,cash,checkoutStyle.askReceived?(cash===0?0:form.elements.received.value.trim()===''?0:inputCents(form.elements.received.value)):cash)});
   const external=method==='mixed'?form.elements.externalMethod.value:method;
   referenceForTender(payment.referencePolicy,external,form.elements.namedItem('reference:'+external)?.value);
   output.innerHTML=tenderSummaryHtml({totalCents:payment.totalCents,cashPartCents:cash,receivedCents:tender.receivedCents,discountCents:payment.discountCents||0,externalLabel:payment.paymentLabels?.[external]||paymentLabel(external)});
   output.dataset.state=tender.cashCovered?'ready':'pending';confirm.disabled=busy||!tender.cashCovered||method!=='cash'&&!form.elements.cardAccepted.checked;
  }catch(error){output.textContent=error.message||'Revisa los importes del cobro.';output.dataset.state='invalid';confirm.disabled=true;}}
 function change(event){
  if(!host||busy||!allowed()||mountedActor!==identity())return;
  if(event.target.matches('[data-tpv-settings-section]')){const destination=event.target.value;event.target.value=referenceSection;Array.from(host.querySelectorAll('[data-tpv-reference-section]')).find(button=>button.dataset.tpvReferenceSection===destination)?.click();return;}
  if(event.target.dataset.tpvInventoryCount){event.target.reportValidity();return;}
  if(event.target.hasAttribute('data-signature-reviewed')){signaturePanel.review(event.target.checked,host);return;}
  if(updateCashCount(event.target)){rememberForm(event.target);reflectTender();return;}
  if(['opening','received','counted'].includes(event.target.name))clearCashCount(event.target.form,event.target.name);
  if(event.target.hasAttribute('data-tpv-product-images')){const files=[...event.target.files];return work(()=>productIntake.images(files));}
  if(productIntake.input(event.target))return;
  if(event.target.matches('[data-credit-method]')){creditCollections.capture(event.target.form);render();return;}
  if(event.target.matches('[data-tpv-order-search] [name=orderId]')){orderLookup=event.target.value;return;}
  updateReceiptPreview(event.target);
  if(catalogueTable.change(event.target))return;
  if(barcodePanel.input(event.target))return;
  if(event.target.closest('[data-tpv-barcode-form]'))return;
  if(stockIntake.input(event.target))return;
  if(event.target.hasAttribute('data-tpv-report-id'))return work(()=>reports.change(event.target));
  if(event.target.matches('[data-tpv-config-connection]')){
   const connectionId=event.target.value;if(!canAssign()||!readConfiguration||!configuration?.connections?.some(row=>row.connectionId===connectionId)||connectionId===configuration.connectionId)return;
   return work(async()=>{
    if((formValues.configure||accessPanel.hasDraft()||accessBatch.hasDraft())&&!await askCurrent('¿Cambiar de web y descartar la preparación sin guardar?',{acceptLabel:'Cambiar de web'}))return;
    const run=generation,owner=identity(),next=await readConfiguration({connectionId});
    if(run!==generation||owner!==identity()||!host||!canAssign())throw Error('La sesión ha cambiado. Vuelve a abrir la configuración.');
    if(next.connectionId!==connectionId)throw Error('No se ha confirmado la web seleccionada.');
    accessBatch.reset();accessPanel.load(next);configuration=next;configurationId=crypto.randomUUID();delete formValues.configure;formDirty=Object.keys(formValues).length>0;notice='Web seleccionada. Revisa su tienda, caja y operador.';
   });
  }
  if(event.target.matches('[data-tpv-variant-group]')){const next=Number(event.target.value);if(!products.variantGroups?.some(row=>row.id===next)&&next!==0)return;return work(async()=>{await reloadProducts({variantGroupId:next,sortField:'name',sortDirection:'asc',page:0});variantGroupId=next;catalogueSort={field:'name',direction:'asc'};productPage=0;});}
  if(event.target.matches('[data-tpv-variant-order]')){const [field,direction]=event.target.value.split(':');if(!['name','stock','price','reference'].includes(field)||!['asc','desc'].includes(direction))return;return work(async()=>{await reloadProducts({sortField:field,sortDirection:direction,page:0});catalogueSort={field,direction};productPage=0;scheduleCatalogueRefresh();});}
  if(event.target.matches('[data-tpv-view]')){if(variantProduct)variantView=event.target.value;else catalogueView=event.target.value;render();return;}
  if(event.target.matches('[data-tpv-disabled-stock]')){if(tab!=='stock'||!canReceiveStock())return;const value=event.target.checked;searchRevision++;clearTimeout(searchTimer);return work(async()=>{includeDisabledStock=value;products=[];variantProduct=0;variantGroupId=0;productPage=0;await reloadProducts();});}
  if(event.target.matches('[data-tpv-category]')){categoryId=Number(event.target.value);productPage=0;variantProduct=0;products=[];return work(reloadProducts);}
  const batchForm=event.target.closest('[data-tpv-access-batch-form]');if(batchForm){if(event.type==='change'&&accessBatch.filter(event.target)){render();return;}accessBatch.capture(batchForm);return;}
  if(accessPanel.input(event.target))return;
  if(event.target.hasAttribute('data-tpv-customer-position'))changeCustomerFieldPosition(event.target);
  rememberForm(event.target);
  if(event.target.closest('[data-tpv-form="customer-settings"]')&&(event.target.hasAttribute('data-tpv-customer-position')||/^(customerFields|addressFields)-.*-visible$/.test(event.target.name))){render();return;}
  if(event.target.closest('[data-tpv-form="ticket"]'))reflectLineTotals();
  if(event.target.hasAttribute('data-tpv-client-country'))return work(()=>customers.change(event.target));
  if(event.target.matches('[data-tpv-config-store]')){if(formValues.configure)delete formValues.configure.drawer;render();return;}
  if(event.target.dataset.tpvLineKind&&!payment&&can('edit')){const line=lines.find(l=>l.productId===event.target.dataset.tpvLineKind);
   if(line){line.discountKind=event.target.value;line.discountValue='';render();if(live())void refreshBasketPrices();}return;}
  if(event.target.hasAttribute('data-tpv-ticket-logo')){const file=event.target.files?.[0];if(file)return work(()=>ticketBranding.change(file));return;}
  if(event.target.matches('[data-tpv-settings-store]'))return work(()=>changeSettingsScope(context.drawers.find(row=>row.storeId===event.target.value)?.id));
  if(event.target.matches('[data-tpv-settings-drawer]'))return work(()=>changeSettingsScope(event.target.value));
  if(event.target.matches('[data-tpv-store]')&&!session){const store=event.target.value,drawer=context.drawers.find(d=>d.storeId===store)?.id||'';return changeWorkstation(store,drawer);}
  if(event.target.matches('[data-tpv-drawer]')&&!session)return changeWorkstation(selectedStore||context.stores[0]?.id,event.target.value);
  if(event.target.matches('[data-tpv-method]')){
   reflectPaymentMethod();return;
  }
  if(event.target.name==='externalMethod'&&event.target.closest('[data-tpv-form="pay"]')){reflectPaymentMethod();return;}
  if(event.target.dataset.tpvQuantity&&!payment&&canSell()){const line=lines.find(l=>l.productId===event.target.dataset.tpvQuantity),value=Number(event.target.value),
   available=products.find(p=>p.id===line?.productId)?.stock??line?.stock;
   if(line&&event.target.value!==''&&Number.isSafeInteger(value)&&value>=(line.minimumQty||1)&&value<=10000&&(value<=available||canExceedStock(line,stockRules))){const changed=line.qty!==value;line.qty=value;failure='';if(live()&&changed)void refreshBasketPrices();}
   else {failure='La cantidad debe ser entera y no superar las existencias disponibles.';event.target.reportValidity();}}
 }
 function input(event){if(!host||busy||!allowed()||mountedActor!==identity())return;
  if(event.target.closest('[data-native-checkout]')){nativeCheckout.input(event);return;}
  if(event.target.closest('[data-native-promotion]')){nativePromotion.input(event);return;}
  if(event.target.closest('[data-native-loyalty]')){nativeLoyalty.input(event);return;}
  if(event.target.dataset.tpvInventoryCount){const product=products.find(r=>r.id===event.target.dataset.tpvInventoryCount);if(!product)return;try{inventoryPanel.count(product,event.target.value);event.target.setCustomValidity('');const rows=inventoryPanel.snapshot(),row=rows.find(r=>r.id===product.id),difference=event.target.closest('tr')?.querySelector('[data-inventory-difference]');if(difference)difference.textContent=String(row.count-row.expected);const totals=host.querySelectorAll('.tpv-inventory-summary strong');[rows.length,rows.filter(r=>r.count!==r.expected).length,rows.reduce((n,r)=>n+r.count,0)].forEach((v,i)=>{if(totals[i])totals[i].textContent=String(v);});const save=host.querySelector('[data-tpv-action="inventory-save"]');if(save)save.disabled=false;const list=host.querySelector('.tpv-inventory-counted');if(list)list.innerHTML=rows.map(r=>'<div><strong>'+esc(r.name)+'</strong><span>'+r.expected+' → '+r.count+' <b>'+(r.count-r.expected)+'</b></span></div>').join('');}catch(error){event.target.setCustomValidity(error.message);}return;}

  if(event.target.matches('[data-tpv-settings-search]')){
   const normalize=value=>String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('es'),terms=normalize(event.target.value).trim().split(/\s+/).filter(Boolean);
   let count=0;host.querySelectorAll('[data-tpv-settings-keywords]').forEach(item=>{item.hidden=!terms.every(term=>normalize(item.dataset.tpvSettingsKeywords).includes(term));if(!item.hidden)count++;});
   const status=host.querySelector('[data-tpv-settings-search-status]');if(status){status.hidden=!terms.length;status.textContent=count?`${count} apartados con coincidencias`:'No hay coincidencias. Prueba otro término.';}return;
  }
  if(barcodePanel.input(event.target))return;
  if(event.target.closest('[data-tpv-barcode-form]'))return;
  if(event.target.name==='note'&&event.target.closest('[data-tpv-form="ticket"]')){try{if(saleNote(event.target.value)&&failure==='Añade la nota interna antes de calcular el cobro.'){failure='';host.querySelector('.tpv-workarea>.note.bad')?.remove();}}catch{}}
  if(updateCashCount(event.target)){rememberForm(event.target);reflectTender();return;}
  if(['opening','received','counted'].includes(event.target.name))clearCashCount(event.target.form,event.target.name);
  if(productIntake.input(event.target))return;
  updateReceiptPreview(event.target);
  if(catalogueTable.input(event.target))return;
  if(stockIntake.input(event.target)){render();return;}
  if(event.target.dataset.tpvQuantity&&!payment&&canSell()){
   const target=event.target,line=lines.find(l=>l.productId===target.dataset.tpvQuantity),qty=Number(target.value),
    available=products.find(p=>p.id===line?.productId)?.stock??line?.stock,
    valid=line&&target.value!==''&&Number.isSafeInteger(qty)&&qty>=(line.minimumQty||1)&&qty<=10000&&(qty<=available||canExceedStock(line,stockRules));
   target.setCustomValidity(valid?'':'Indica unidades enteras dentro del stock disponible.');
   if(valid){line.qty=qty;if(live())void refreshBasketPrices();else reflectLineTotals();}
   return;
  }
  if(event.target.closest('[data-tpv-client-form]')){customers.input(event.target.form);return;}
  if(event.target.dataset.tpvLineValue&&!payment&&can('edit')){const line=lines.find(l=>l.productId===event.target.dataset.tpvLineValue);if(line){line.discountValue=event.target.value;reflectLineTotals();}return;}
  const batchForm=event.target.closest('[data-tpv-access-batch-form]');if(batchForm){if(event.type==='change'&&accessBatch.filter(event.target)){render();return;}accessBatch.capture(batchForm);return;}
  if(accessPanel.input(event.target))return;
  if(!event.target.matches('[data-tpv-search]')){rememberForm(event.target);if(event.target.closest('[data-tpv-form="ticket"]'))reflectLineTotals();if(event.target.closest('[data-tpv-form="pay"]'))reflectTender();return;}search=event.target.value;productPage=0;variantProduct=0;clearTimeout(searchTimer);
  const run=generation,request=++searchRevision,query=search,currentTab=tab,inventoryQuery=inventoryCatalogueQuery();searchTimer=setTimeout(async()=>{try{const found=await adapter.searchProducts({sessionId:session.id,search:query,categoryId,sortField:catalogueSort.field,sortDirection:catalogueSort.direction,searchFields:searchOptions.fields,catalogueFilters:currentCatalogueFilters(),...inventoryQuery});
   if(run!==generation||request!==searchRevision||busy||tab!==currentTab||!['sale','stock','inventory'].includes(tab))return;
   products=found;scheduleCatalogueRefresh();const focus=host.querySelector('[data-tpv-search]');if(!focus)return;const start=focus.selectionStart;
   const wasFocused=document.activeElement===focus;render();const next=host.querySelector('[data-tpv-search]');
   if(next&&wasFocused){next.focus();next.setSelectionRange(start,start);}
  }catch(error){if(run===generation&&request===searchRevision){failure=error.message;render();}}},150);}
 function changeWorkstation(store,drawer){
  if(live()||central())return work(async()=>{
   if(central()){
    if(hasDraft())throw Error('Termina o aparca el ticket y guarda los cambios antes de cambiar de caja.');
    context=await adapter.context();
    if(!context.drawers.some(d=>d.id===drawer&&d.storeId===store))throw Error('Ya no tienes acceso a esa caja.');
    const nextSession=context.sessions.find(s=>s.drawerId===drawer&&s.status==='open')||null;
    if(nextSession)await adapter.selectSession(nextSession);else await adapter.selectWorkstation({storeId:store,drawerId:drawer});
    session=nextSession;selectedStore=store;selectedDrawer=drawer;centralSettingsDrawerId=drawer;delete formValues.open;
    products=[];categories=[];receipt=null;documentPreview=null;summary=null;reports.reset();tab='sale';notice='';
    await loadWorkspacePreferences();if(session)await reloadProducts();return;
   }
   if(formValues['customer-settings']&&!await askCurrent('¿Cambiar de caja y descartar los cambios de clientes sin guardar?'))return;
   if(formValues['payment-settings']&&!await askCurrent('¿Cambiar de caja y descartar los cambios de medios de cobro sin guardar?'))return;
   if(signaturePanel.hasDraft())throw Error('Guarda, recupera o cancela la firma actual antes de cambiar de caja.');
   await adapter.selectWorkstation({storeId:store,drawerId:drawer});
   signaturePanel.reset();if(tab==='signature')tab='sale';
   selectedStore=store;selectedDrawer=drawer;reports.reset();
   delete formValues['customer-settings'];delete formValues['payment-settings'];formDirty=Object.keys(formValues).length>0;
   await loadWorkspacePreferences();
  });
  selectedStore=store;selectedDrawer=drawer;reports.reset();render();
 }
 function fitActionsMenu(){
  const details=host?.querySelector('.tpv-actions');if(!details?.open)return;
  const panel=details.querySelector(':scope > div'),anchor=details.querySelector('summary').getBoundingClientRect(),bounds=host.getBoundingClientRect();
  const below=Math.min(window.innerHeight,bounds.bottom)-anchor.bottom,above=anchor.top-Math.max(0,bounds.top),up=below<160&&above>below;
  panel.style.top=up?'auto':'100%';panel.style.bottom=up?'100%':'auto';panel.style.maxHeight=Math.max(44,Math.min(480,(up?above:below)-12))+'px';
 }
 function sizeWorkspace(){if(host){host.style.setProperty('--tpv-height',Math.max(360,window.innerHeight-Math.max(0,host.getBoundingClientRect().top)-12)+'px');fitActionsMenu();}}
 function dispose(){orderWatch.stop();orderNotices=orderNoticeOptions();orderNoticeRevision=0;nativeCheckout.reset();nativePromotion.reset();nativeLoyalty.reset();centralSettingsDrawerId='';generalSetup.dispose();receiptSetup.dispose();cashSetup.dispose();paymentSetup.dispose();permissionsSetup.dispose();Object.values(ownedSetups).forEach(panel=>panel.dispose());taxGroupPicker.cancel();taxRules=taxPreference();ticketBranding.reset();settingsDrawerId='';settingsAdapter=null;saleCatalogueBeforeSettings=null;workstationOpen=false;basketPriceRevision++;basketPreview=null;clearTimeout(basketPriceTimer);catalogueBackground.stop();clearTimeout(onlineSyncTimer);onlineSyncTimer=null;onlineSyncRequested=false;offlinePanel.reset();signaturePanel.reset();barcodePanel.reset();operatorPicker.cancel();passwordPrompt.cancel();quantityPicker.cancel();lineNameEditor.cancel();customerScreen.close();accessBatch.reset();accessPanel.reset();productIntake.reset();if(audioFeedback){void audioFeedback.close().catch(()=>{});audioFeedback=null;}generation++;searchRevision++;clearTimeout(searchTimer);clearTimeout(catalogueRefreshTimer);abort?.abort();catalogueTable.dispose();host=null;busy=false;scanQueue=[];scanning=false;mobilePane='catalogue';}
 return {mount(root){dispose();host=root;mountedActor=identity();
   budgetPending=false;
   includeDisabledStock=false;
   stockIntake.reset();inventoryPanel.reset();
   catalogueTable.setColumns();catalogueSort={field:'name',direction:'asc'};variantGroupId=0;variantProductName='';variantView='';parentCatalogueSort=null;
   checkoutStyle={...CHECKOUT_DEFAULTS};operatorRules={switchEnabled:true,revision:0,requireAtCheckout:false};cashVisibilityRules={hideSummary:false};drawerPayments=null;customMenuLinks=[];returnRules={allowPartial:true};signatureRules=signatureOptions();orderLookup='';focusOrderLookup=false;webHistory=false;stockRules=stockPolicy();priceRules=lineOptions();parkingRules=parkingOptions();displayOptions=displayPreferences();searchOptions=searchPreferences();catalogueOptions=cataloguePreferences();receiptStyle=receiptOptions();cashStyle=cashOptions();customerScreenOptions=customerDisplayOptions();incidentForm=false;categories=[];categoryId=0;initialCategoryId=0;catalogueView='grid';adapter=null;context=null;session=null;lines=[];receipt=null;payment=null;notice='';failure='';tab='sale';returnForm=null;paymentValues={};
   formValues={};formDirty=false;selectedStore='';selectedDrawer='';search='';products=[];history=[];summary=null;setup=null;productPage=0;variantProduct=0;stockProduct=null;configuration=null;configurationId=null;documentPreview=null;selectedCustomer=null;customers.reset();reports.reset();parked=[];draftInfo=null;budgetPage={items:[],hasMore:false};selectedBudget=null;budgetEditing=false;budgetQuery='';
   if(!allowed()){host.innerHTML='<p role="alert">Necesitas acceso a Ventas y Cajas para usar TotusTPV.</p>';return;}
   abort=new AbortController();for(const [type,handler] of [['click',click],['submit',submit],['change',change],['input',input],['keydown',keydown]])
   host.addEventListener(type,handler,{signal:abort.signal});window.addEventListener('online',()=>{onlineSyncRequested=true;syncAfterReconnect();},{signal:abort.signal});window.addEventListener('pagehide',()=>customerScreen.close(),{signal:abort.signal});window.addEventListener('resize',sizeWorkspace,{signal:abort.signal});document.addEventListener('fullscreenchange',sizeWorkspace,{signal:abort.signal});render();if(referencePreview)void work(async()=>{adapter=bindPractice();context=await adapter.context();await ticketBranding.open(context.drawers[0],false);categories=await adapter.categories();session=context.sessions.find(s=>s.status==='open')||await adapter.openSession({storeId:context.stores[0].id,drawerId:context.drawers[0].id,openingCents:0});selectedStore=session.storeId;selectedDrawer=session.drawerId;categoryId=visibleCategories().some(row=>row.id===initialCategoryId)?initialCategoryId:0;await reloadProducts();});else if(autoOpen&&createLiveAdapter)void work(()=>openLive(false));},dispose,
   hasDraft,requestLeave};
}
