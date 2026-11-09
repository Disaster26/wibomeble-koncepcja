(function(){
  var rok=document.querySelectorAll('[data-rok]');
  for(var i=0;i<rok.length;i++) rok[i].textContent=new Date().getFullYear();

  /* menu mobilne */
  var bg=document.querySelector('.burger'),mm=document.querySelector('.menu-mob');
  if(bg&&mm){bg.addEventListener('click',function(){var o=mm.classList.toggle('otw');bg.setAttribute('aria-expanded',o);document.body.style.overflow=o?'hidden':'';});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&mm.classList.contains('otw')){mm.classList.remove('otw');bg.setAttribute('aria-expanded',false);document.body.style.overflow='';}});}

  /* pokaz zdjec w hero: auto + swipe */
  var pk=document.querySelector('.pokaz');
  if(pk){
    var tor=pk.querySelector('.pokaz-tor'),n=tor.children.length,ak=0,kr=pk.querySelectorAll('.kropki button'),tm;
    function idz(k){ak=(k+n)%n;tor.style.transform='translateX('+(-100*ak)+'%)';for(var j=0;j<kr.length;j++)kr[j].setAttribute('aria-current',j===ak);start();}
    function start(){clearInterval(tm);if(!matchMedia('(prefers-reduced-motion:reduce)').matches)tm=setInterval(function(){idz(ak+1)},5500);}
    for(var j=0;j<kr.length;j++)(function(j){kr[j].addEventListener('click',function(){idz(j)})})(j);
    var x0=null,y0=0;
    pk.addEventListener('pointerdown',function(e){x0=e.clientX;y0=e.clientY;});
    pk.addEventListener('pointerup',function(e){if(x0===null)return;var dx=e.clientX-x0,dy=e.clientY-y0;if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy))idz(ak+(dx<0?1:-1));x0=null;});
    pk.addEventListener('pointercancel',function(){x0=null});
    start();
  }

  /* lightbox */
  var lb=document.querySelector('.lb'),lbImg,lbOpis,lista=[],poz=0;
  if(lb){lbImg=lb.querySelector('img');lbOpis=lb.querySelector('.opis');
    function pokaz(){var it=lista[poz];lbImg.src=it.src;lbImg.alt=it.alt;lbOpis.textContent=it.alt+'  '+(poz+1)+' / '+lista.length;}
    function zamk(){lb.classList.remove('otw');document.body.style.overflow='';}
    lb.querySelector('.zamk').onclick=zamk;
    lb.querySelector('.l').onclick=function(){poz=(poz-1+lista.length)%lista.length;pokaz()};
    lb.querySelector('.p').onclick=function(){poz=(poz+1)%lista.length;pokaz()};
    lb.addEventListener('click',function(e){if(e.target===lb)zamk()});
    document.addEventListener('keydown',function(e){if(!lb.classList.contains('otw'))return;if(e.key==='Escape')zamk();if(e.key==='ArrowLeft')lb.querySelector('.l').click();if(e.key==='ArrowRight')lb.querySelector('.p').click();});
    var lx=null;lb.addEventListener('pointerdown',function(e){lx=e.clientX});lb.addEventListener('pointerup',function(e){if(lx===null)return;var d=e.clientX-lx;if(Math.abs(d)>50)lb.querySelector(d<0?'.p':'.l').click();lx=null;});
    window.otworzLb=function(l,p){lista=l;poz=p;pokaz();lb.classList.add('otw');document.body.style.overflow='hidden';lb.querySelector('.zamk').focus();};
  }

  /* paski galerii: przeciaganie mysza, strzalki, licznik, klik = powiekszenie */
  var paski=document.querySelectorAll('.pasek');
  for(var p=0;p<paski.length;p++)(function(ps){
    var t=ps.querySelector('.pasek-tor'),bt=t.querySelectorAll('button'),lic=ps.parentNode.querySelector('.licznik'),l=ps.querySelector('.pasek-str.l'),r=ps.querySelector('.pasek-str.p');
    var items=[];for(var i=0;i<bt.length;i++){var im=bt[i].querySelector('img');items.push({src:bt[i].getAttribute('data-duze'),alt:im.alt});}
    var dn=false,sx=0,sl=0,ruch=0;
    t.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;dn=true;ruch=0;sx=e.clientX;sl=t.scrollLeft;t.classList.add('ciagnie');});
    window.addEventListener('pointermove',function(e){if(!dn)return;ruch=Math.max(ruch,Math.abs(e.clientX-sx));t.scrollLeft=sl-(e.clientX-sx);});
    window.addEventListener('pointerup',function(){if(!dn)return;dn=false;t.classList.remove('ciagnie');});
    for(var i=0;i<bt.length;i++)(function(i){bt[i].addEventListener('click',function(e){if(ruch>6){e.preventDefault();ruch=0;return;}if(window.otworzLb)window.otworzLb(items,i);});})(i);
    function stan(){var max=t.scrollWidth-t.clientWidth-2;if(l)l.disabled=t.scrollLeft<=2;if(r)r.disabled=t.scrollLeft>=max;
      if(lic&&bt.length>1){var k=0;for(var i=0;i<bt.length;i++){if(bt[i].offsetLeft-t.offsetLeft<=t.scrollLeft+8)k=i;}if(t.scrollLeft>=max)k=bt.length-1;lic.textContent='Zdjęcie '+(k+1)+' z '+bt.length+' - przesuń lub kliknij, aby powiększyć';}}
    function krok(d){var w=t.clientWidth*0.8;t.scrollBy({left:d*w,behavior:'smooth'});}
    if(l)l.onclick=function(){krok(-1)};if(r)r.onclick=function(){krok(1)};
    t.addEventListener('scroll',stan,{passive:true});window.addEventListener('resize',stan);
    var imgs=t.querySelectorAll('img');for(var i=0;i<imgs.length;i++)imgs[i].addEventListener('load',stan);
    stan();
  })(paski[p]);

  var kf=document.querySelectorAll('.kat-foto');
  for(var i=0;i<kf.length;i++)kf[i].addEventListener('click',function(){var im=this.querySelector('img');if(window.otworzLb)window.otworzLb([{src:this.getAttribute('data-duze'),alt:im.alt}],0);});

  /* przeciaganie mysza kart pokoi */
  var pokoje=document.querySelector('.pokoje');
  if(pokoje){var d2=false,s2=0,l2=0,m2=0;
    pokoje.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse'||pokoje.scrollWidth<=pokoje.clientWidth)return;d2=true;m2=0;s2=e.clientX;l2=pokoje.scrollLeft;});
    window.addEventListener('pointermove',function(e){if(!d2)return;m2=Math.max(m2,Math.abs(e.clientX-s2));pokoje.scrollLeft=l2-(e.clientX-s2);});
    window.addEventListener('pointerup',function(){d2=false});
    pokoje.addEventListener('click',function(e){if(m2>6){e.preventDefault();m2=0;}},true);
  }

  /* pasek mobilny po przewinieciu za przycisk */
  var mob=document.querySelector('.mob'),cel=document.querySelector('[data-cta]');
  if(mob){if(cel&&'IntersectionObserver' in window){new IntersectionObserver(function(en){var e=en[0];mob.classList.toggle('widac',!e.isIntersecting&&e.boundingClientRect.top<0);}).observe(cel);}
    else{window.addEventListener('scroll',function(){mob.classList.toggle('widac',scrollY>400)},{passive:true});}}

  /* formularz pokazowy */
  var f=document.querySelector('.form');
  if(f)f.addEventListener('submit',function(e){e.preventDefault();var inf=f.querySelector('.form-info');inf.textContent='To jest wersja pokazowa - formularz zostanie podłączony do skrzynki wibo75@wp.pl po wdrożeniu.';});

  /* baner zgod */
  var c=document.querySelector('.ciastka');
  if(c){var zap=null;try{zap=localStorage.getItem('wibo-zgoda')}catch(e){}
    if(!zap)c.classList.add('widac');
    var bs=c.querySelectorAll('button');for(var i=0;i<bs.length;i++)bs[i].addEventListener('click',function(){try{localStorage.setItem('wibo-zgoda',this.getAttribute('data-z'))}catch(e){}c.classList.remove('widac');});}
})();
