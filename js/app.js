const roles=[
['cashier','Cashier','Store Operations','Help customers at checkout and handle purchases with care.','Cashiers support the checkout experience by scanning purchases, processing payments and helping customers.'],
['shelf-attendant','Shelf Attendant','Store Operations','Keep shelves stocked, organised and easy to shop.','Shelf attendants organise stock, replenish displays and help maintain tidy, accessible aisles.'],
['customer-service','Customer Service','Store Operations','Assist customers and respond to their questions.','Customer service teams help shoppers find information, respond to enquiries and support a positive store experience.'],
['security-officer','Security Officer','Security','Help maintain a safe and welcoming shopping environment.','Security officers support the safety of customers, colleagues and store premises.'],
['butchery-assistant','Butchery Assistant','Food & Fresh','Support meat preparation and counter presentation.','Butchery assistants support the preparation, presentation and handling of products in a food-service setting.'],
['bakery-assistant','Bakery Assistant','Food & Fresh','Help prepare and present fresh bakery products.','Bakery assistants support the preparation, packaging and display of baked goods.'],
['cleaner','Cleaner','Support Services','Help keep the store clean and comfortable.','Cleaners help maintain clean, welcoming store spaces and work areas.'],
['warehouse-assistant','Warehouse Assistant','Warehouse & Logistics','Help receive, organise and dispatch stock.','Warehouse assistants help receive goods, organise inventory and prepare stock for distribution.'],
['driver','Driver','Warehouse & Logistics','Support the movement of goods between locations.','Drivers help transport goods safely between distribution facilities and stores.'],
['it-support','IT Support','Support Services','Support the technology used across retail operations.','IT support staff help maintain computers, systems and technology used by colleagues.'],
['human-resource-officer','Human Resource Officer','Management','Support people, recruitment and workplace processes.','Human resources professionals support employee processes, development and workplace administration.'],
['finance-assistant','Finance Assistant','Management','Support financial administration and reporting.','Finance assistants help organise records, process financial information and support reporting.']];
const regions=[['Main Locations',['Nairobi','Nakuru','Mombasa','Kiambu','Machakos']],['Central & Eastern',['Nyeri','Embu','Kitui','Kajiado','Narok']],['Western Region',['Kisumu','Bungoma','Kisii']],['Northern Region',['Eldoret','Kapsabet','Kericho']],['Coastal Region',['Malindi','Kwale','Kilifi']]];
const allLocations=regions.flatMap(([,cities])=>cities);

const majorTowns=['Nairobi','Mombasa','Kiambu','Machakos','Malindi','Kwale','Kilifi'];
const secondaryTowns=['Kisumu'];
const quietLocations=['Embu','Kisii','Eldoret','Kericho'];

const totalJobsMap={
'cashier':10,
'shelf-attendant':8,
'customer-service':4,
'security-officer':5,
'butchery-assistant':4,
'bakery-assistant':4,
'cleaner':5,
'warehouse-assistant':5,
'driver':3,
'it-support':2,
'human-resource-officer':2,
'finance-assistant':2};

const salaryMap={
'cashier':[28000,38000],
'shelf-attendant':[24000,32000],
'customer-service':[30000,40000],
'security-officer':[26000,35000],
'butchery-assistant':[30000,42000],
'bakery-assistant':[28000,40000],
'cleaner':[20000,28000],
'warehouse-assistant':[27000,37000],
'driver':[40000,55000],
'it-support':[50000,70000],
'human-resource-officer':[65000,95000],
'finance-assistant':[55000,80000]};
const fmt=n=>n.toLocaleString('en-KE');
const salary=(slug)=>{const s=salaryMap[slug];return s?`KES ${fmt(s[0])} – ${fmt(s[1])} / mo`:''};

const coreRoles=['cashier','security-officer','shelf-attendant'];
const fillerRoles=['bakery-assistant','warehouse-assistant'];

const pinnedVacancies={
'Embu':{'shelf-attendant':1,'security-officer':1},
'Kisii':{'shelf-attendant':2},
'Eldoret':{'shelf-attendant':1,'security-officer':1},
'Kericho':{'security-officer':2}
};

function cityHash(city){let h=0;for(let i=0;i<city.length;i++){h=(h*31+city.charCodeAt(i))>>>0}return h}

function cityVacancies(city){
  if(pinnedVacancies[city])return pinnedVacancies[city];

  const isMajor=majorTowns.includes(city);
  const isSecondary=secondaryTowns.includes(city);
  if(!isMajor&&!isSecondary)return {};

  const cap=isMajor?4:3;
  const seed=cityHash(city);
  const out={};

  coreRoles.forEach(r=>{out[r]=1;});
  let total=coreRoles.length;

  if(isMajor&&total<cap){
    const extra=cap-total;
    const pool=fillerRoles.slice();
    for(let i=pool.length-1;i>0;i--){const j=(seed*(i+1))%(i+1);[pool[i],pool[j]]=[pool[j],pool[i]]}
    for(let k=0;k<extra&&k<pool.length;k++){
      out[pool[k]]=1;
      total++;
    }
  }

  if(isMajor&&total<cap){
    const target=coreRoles[seed%coreRoles.length];
    const add=Math.min(cap-total,2);
    out[target]=(out[target]||0)+add;
  }

  return out;
}

function totalJobs(city,slug){
  const base=totalJobsMap[slug]||3;
  const h=cityHash(city+slug);
  const variation=(h%5)-2;
  return Math.max(1,base+variation);
}

const counts=(city,slug)=>{
  const total=totalJobs(city,slug);
  const vacant=(cityVacancies(city)[slug])||0;
  const occupied=total-vacant;
  return `<div class="role-counts" aria-label="Job counts"><div><strong>${total}</strong><span>Total jobs</span></div><div><strong>${occupied}</strong><span>Occupied</span></div><div><strong>${vacant}</strong><span>Vacant</span></div></div>`;
};

const applyNowBtn=(slug,city)=>{
  const v=(cityVacancies(city)[slug])||0;
  if(v<=0)return '';
  return `<a class="btn apply-now" href="#apply/${encodeURIComponent(slug)}?location=${encodeURIComponent(city)}">Apply now <span>→</span></a>`;
};

function locationsSection(){return `<section class="section locations-section" id="choose-location"><div class="wrap"><div class="section-head"><div><span class="eyebrow">Find opportunities near you</span><h2>OUR LOCATIONS</h2><p class="script location-script">Your next opportunity starts here.</p><p>Choose your location to explore career categories and see the available job information.</p></div></div><div class="regions">${regions.map(([region,cities])=>`<div class="region"><h3>${esc(region)}</h3><div class="location-list">${cities.map(city=>{const v=cityVacancies(city);const total=Object.values(v).reduce((a,b)=>a+b,0);return `<a href="#location/${encodeURIComponent(city)}"><span>${esc(city)}</span>${total>0?`<span class="vac-badge">${total} vacant</span>`:'<span aria-hidden="true">↗</span>'}</a>`}).join('')}</div></div>`).join('')}</div></div></section>`}

function locationPage(raw){let city;try{city=decodeURIComponent(raw)}catch{city=''};if(!allLocations.includes(city))return `<section class="wrap section"><h2>LOCATION NOT FOUND</h2><a class="btn green" href="#locations">Choose a location</a></section>`;return `<div class="wrap breadcrumb"><a href="#home">Home</a> &nbsp;›&nbsp; <a href="#locations">Our locations</a> &nbsp;›&nbsp; ${esc(city)}</div><section class="wrap location-hero"><div class="location-image"><img src="assets/images/store.jpg" alt="Supermarket image" /></div><div class="location-intro"><span class="eyebrow">Your selected location</span><h1>NAIVAS ${esc(city)}</h1><p class="script">Explore possibilities near you.</p><p><strong>Location:</strong> ${esc(city)}, Kenya</p><p>Specific branch name and street address have not been provided.</p><a class="text-link" href="#locations">← Change location</a></div></section><section class="section soft"><div class="wrap"><div class="section-head"><div><span class="eyebrow">Explore careers</span><h2>ROLES IN ${esc(city)}</h2><p class="script location-script">Every role makes a difference.</p><p>Explore the different roles and their job counts below.</p></div></div><div class="cards location-cards">${roles.map(r=>`<article class="card location-card"><a href="#role/${r[0]}?location=${encodeURIComponent(city)}"><img src="${image(r[0])}" alt="${esc(r[1])} career" loading="lazy"></a><div class="card-body"><h3>${esc(r[1])}</h3><p>${esc(r[3])}</p><div class="tag">${esc(r[2])}</div><div class="pill salary-pill">${salary(r[0])}</div>${counts(city,r[0])}${applyNowBtn(r[0],city)}<a class="btn green" href="#role/${r[0]}?location=${encodeURIComponent(city)}">View role <span>→</span></a></div></article>`).join('')}</div></div></section>`}

const cats=[['Store Operations','cashier','Cashier, shelf and customer service'],['Security','security-officer','Safety and asset protection'],['Food & Fresh','bakery-assistant','Bakery, butchery and fresh food'],['Warehouse & Logistics','warehouse-assistant','Stock, dispatch and delivery'],['Management','human-resource-officer','People, finance and support']];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const image=(s)=>`assets/images/${s}.png`;
const notice=()=>'';
const card=r=>`<article class="card"><a href="#role/${r[0]}"><img src="${image(r[0])}" alt="${esc(r[1])} career" loading="lazy"></a><div class="card-body"><h3>${esc(r[1])}</h3><p>${esc(r[3])}</p><div class="tag">${esc(r[2])}</div><div class="pill salary-pill">${salary(r[0])}</div><a class="btn green" href="#role/${r[0]}">View details <span>→</span></a></div></article>`;
const trust=`<div class="trust"><div class="wrap trust-inner"><div class="trust-item"><span class="trust-icon">✓</span><div><strong>APPLICATIONS ARE FREE</strong><small>Never pay to apply</small></div></div><div class="trust-item"><span class="trust-icon">◇</span><div><strong>EXPLORE CAREERS</strong><small>Discover paths in retail</small></div></div><div class="trust-item"><span class="trust-icon">◎</span><div><strong>STAY INFORMED</strong><small>Check official channels</small></div></div><div class="trust-item"><span class="trust-icon">↗</span><div><strong>GROW YOUR CAREER</strong><small>Explore different roles</small></div></div></div></div>`;
function home(){return `<section class="hero"><div class="wrap hero-inner"><span class="eyebrow">Careers & opportunities</span><h1>BUILD YOUR<br>FUTURE IN RETAIL</h1><div class="script">Explore career paths with Naivas</div><p>Discover the people and roles behind a retail experience that serves communities across Kenya.</p><form id="home-search" class="searchbar"><input name="q" aria-label="Search career categories" placeholder="Search roles (e.g. cashier, security)"><select name="department" aria-label="Select department"><option value="">All departments</option>${[...new Set(roles.map(x=>x[2]))].map(x=>`<option>${esc(x)}</option>`).join('')}</select><button class="btn">Search roles <span>→</span></button></form></div></section>${locationsSection()}${trust}<section class="section"><div class="wrap"><div class="section-head"><div><h2>EXPLORE JOB CATEGORIES</h2><p>Find a career path that fits your interests.</p></div><a class="text-link" href="#opportunities">View all roles →</a></div><div class="category-grid">${cats.map(c=>`<a class="category" href="#opportunities?department=${encodeURIComponent(c[0])}"><img src="${image(c[1])}" alt="" loading="lazy"><div><strong>${c[0]}</strong><small>${c[2]}</small></div></a>`).join('')}</div></div></section><section class="section soft"><div class="wrap split"><img src="assets/images/team.webp" alt="A team of supermarket employees" loading="lazy"><div><span class="eyebrow">People make the difference</span><h2>EVERY ROLE HAS A STORY</h2><p>Behind every well-stocked shelf and friendly checkout is a team of people working together. Explore the many skills that contribute to a welcoming retail experience.</p><a class="btn green" href="#people">Meet the roles <span>→</span></a></div></div></section>`}
function opportunities(params){let q=params.get('q')||'',department=params.get('department')||'';let filtered=roles.filter(r=>(!department||r[2]===department)&&(!q||r.join(' ').toLowerCase().includes(q.toLowerCase())));let depts=[...new Set(roles.map(r=>r[2]))];return `<section class="banner"><div class="wrap" style="width:100%"><h1>OPPORTUNITIES<br>AT NAIVAS</h1><div class="script">Different people. A stronger team.</div></div></section><div class="wrap breadcrumb"><a href="#home">Home</a> &nbsp;›&nbsp; Opportunities</div><section class="wrap" style="padding-bottom:70px"><form id="filters" class="filters"><input name="q" value="${esc(q)}" placeholder="Search for a role or keyword" aria-label="Search roles"><select name="department" aria-label="Department"><option value="">All departments</option>${depts.map(d=>`<option ${d===department?'selected':''}>${esc(d)}</option>`).join('')}</select><button class="btn">Search</button></form><div class="layout"><aside class="sidebar" aria-label="Departments"><h3>DEPARTMENTS</h3>${['All departments',...depts].map(d=>`<a class="side-btn ${(!department&&d==='All departments')||department===d?'active':''}" href="#opportunities${d==='All departments'?'':'?department='+encodeURIComponent(d)}">${esc(d)}</a>`).join('')}</aside><div><div class="section-head"><div><h2>CAREER CATEGORIES</h2><p>Explore the roles that support supermarket operations.</p></div></div><div class="cards">${filtered.map(card).join('')}</div>${!filtered.length?'<p>No career categories match your search. Try a different keyword or department.</p>':''}${notice()}</div></div></section>`}
function detail(slug,params){let r=roles.find(x=>x[0]===slug);if(!r)return `<div class="wrap section"><h2>ROLE NOT FOUND</h2><p>Please explore our career categories.</p><a class="btn green" href="#opportunities">View roles</a></div>`;const city=params.get('location')&&allLocations.includes(params.get('location'))?params.get('location'):null;const vacCount=city?((cityVacancies(city)[slug])||0):0;return `<div class="wrap breadcrumb"><a href="#home">Home</a> &nbsp;›&nbsp; <a href="#opportunities">Opportunities</a> &nbsp;›&nbsp; ${esc(r[1])}</div><section class="wrap detail"><img src="${image(r[0])}" alt="${esc(r[1])} at work"><div><span class="eyebrow">Career category</span><h1>${esc(r[1])}</h1><p>${esc(r[4])}</p><div class="details-meta"><span class="pill">${esc(r[2])}</span><span class="pill salary-pill">${salary(slug)}</span><span class="pill">Career information</span></div><h2>ABOUT THIS ROLE</h2><p>${esc(r[3])} Each role contributes to a positive experience for customers and colleagues.</p><h2>SKILLS THAT MATTER</h2><ul><li>Clear communication and teamwork</li><li>Attention to detail and a reliable approach</li><li>Respect for customers, colleagues and workplace standards</li></ul>${city?`${vacCount>0?`<div class="vacancy-open"><strong>${vacCount} ${vacCount===1?'vacancy':'vacancies'} open in ${esc(city)}</strong><p>Applications are currently being accepted for this role at this location.</p></div>${applyNowBtn(slug,city)}`:`<div class="data-note">This role has no open vacancies in ${esc(city)} right now. Check other locations or explore similar roles.</div>`}${counts(city,slug)}<p><a class="text-link" href="#location/${encodeURIComponent(city)}">← Back to ${esc(city)}</a></p>`:`${notice()}<p><a class="text-link" href="#opportunities">← Back to all career categories</a></p>`}</div></section>`}
function editorial(kind){let data={why:['WHY NAIVAS','Discover a world of retail','Retail brings together people with many different skills. From the shop floor to the warehouse and office, each role contributes to the customer experience.','store.jpg'],people:['OUR PEOPLE','The people behind the experience','Every photograph tells the story of a role: welcoming a customer, caring for a space, preparing fresh food, or helping a team do its best work. Explore the range of careers that make retail possible.','team.webp'],about:['ABOUT','A place to explore career paths','Discover supermarket career categories, learn what each role involves and check for vacancy updates.','store.jpg']}[kind];return `<section class="banner"><div class="wrap" style="width:100%"><h1>${data[0]}</h1><div class="script">People, purpose and possibility.</div></div></section><section class="section"><div class="wrap split"><img src="assets/images/${data[3]}" alt="Supermarket and team"><div><span class="eyebrow">Careers</span><h2>${data[1]}</h2><p>${data[2]}</p><a class="btn" href="#opportunities">Explore career categories →</a></div></div></section><section class="section soft"><div class="wrap"><h2>MADE POSSIBLE BY PEOPLE</h2><div class="features"><div class="feature"><strong>Serving customers</strong><p>Friendly, attentive service makes every visit better.</p></div><div class="feature"><strong>Working together</strong><p>Different teams bring their skills together across retail operations.</p></div><div class="feature"><strong>Keeping things moving</strong><p>From deliveries to technology, many roles support the store.</p></div></div>${notice()}</div></section>`}
const main=document.querySelector('#main'),nav=document.querySelector('#nav'),menu=document.querySelector('#menu');
function render(){let raw=location.hash.slice(1)||'home', [path,query='']=raw.split('?'), p=new URLSearchParams(query);main.innerHTML=path==='home'?home():path==='application-confirmation'?resultPage():path.startsWith('apply/')?applicationPage(decodeURIComponent(path.slice(6)),p):path==='locations'?locationsSection():path.startsWith('location/')?locationPage(path.slice(9)):path==='opportunities'?opportunities(p):path.startsWith('role/')?detail(path.slice(5),p):['why','people','about'].includes(path)?editorial(path):home();document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+(path.startsWith('role/')?'opportunities':path)));nav.classList.remove('open');menu.setAttribute('aria-expanded','false');document.title=path==='home'?'Careers | Explore opportunities':`${path.startsWith('role/')?'Career details':path.charAt(0).toUpperCase()+path.slice(1)} | Careers`;window.scrollTo(0,0);bindApplicationForm();for(const id of ['home-search','filters']){const form=document.getElementById(id);if(form)form.addEventListener('submit',e=>{e.preventDefault();let q=new URLSearchParams(new FormData(form));for(const [k,v] of [...q])if(!v)q.delete(k);let target='#opportunities'+(q.toString()?'?'+q:'');if(location.hash===target)render();else location.hash=target})}}
menu.addEventListener('click',()=>{let open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});window.addEventListener('hashchange',render);render();