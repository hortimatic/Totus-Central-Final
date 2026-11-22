// Discover preparation targets without granting permission to operate them.
export function discoverWorkstations(operational,setup,actorId){
 if(setup?.actorId!==actorId||!Array.isArray(setup.stores)||!Array.isArray(setup.drawers))throw Error('No se pudieron comprobar las tiendas y cajas disponibles.');
 const stores=new Map(operational.stores.map(s=>[s.id,s])),drawers=new Map(operational.drawers.map(d=>[d.id,d]));
 for(const store of setup.stores)if(!stores.has(store.id))stores.set(store.id,store);
 for(const drawer of setup.drawers)if(stores.has(drawer.storeId)&&!drawers.has(drawer.id))drawers.set(drawer.id,{...drawer,mode:'central',requiresSetup:true,canSell:false,canOpen:false,canReconcile:false});
 return {...operational,stores:[...stores.values()],drawers:[...drawers.values()]};
}
