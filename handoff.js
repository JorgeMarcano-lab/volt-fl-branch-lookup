/* Volt - Branch Lookup -> Sales Breakdown handoff v6
   Sin password screen - acceso directo
*/
(function(){
  var SALES_URL = 'sales-breakdown.html';

  var btn = document.createElement('button');
  btn.id = 'proceedBtn';
  btn.textContent = 'Proceder con el Proyecto \u2192';
  btn.style.cssText = [
    'display:none',
    'margin:18px auto 0',
    'padding:13px 22px',
    'background:#e8b000',
    'color:#0d0f14',
    'border:none',
    'border-radius:10px',
    'font-size:0.95rem',
    'font-weight:700',
    'cursor:pointer',
    'font-family:inherit',
    'letter-spacing:0.02em',
    'width:100%',
    'max-width:400px'
  ].join(';');
  btn.onmouseover = function(){ this.style.background = '#ffc82e'; };
  btn.onmouseout  = function(){ this.style.background = '#e8b000'; };

  btn.onclick = function(){
    var out = document.getElementById('out');
    var raw = (document.getElementById('addr') || {}).value || '';

    // AHJ from rendered card
    var ahjEl = out ? out.querySelector('.fv.ahj') : null;
    var ahj = ahjEl ? ahjEl.textContent.trim() : '';

    // Permit ETA
    var permitEta = '';
    if(out){
      var etaEl = out.querySelector('.fv[style*="font-size:1rem"], .fv[style*="font-size: 1rem"]');
      if(etaEl){
        var etaTxt = etaEl.textContent.trim();
        if(/same.?day/i.test(etaTxt)){ permitEta = '0'; }
        else { var nm = etaTxt.match(/\d+/); if(nm) permitEta = nm[0]; }
      }
    }

    var m = raw.match(/\b(3[0-9]{4})\b/g);
    var zip = m ? m[m.length-1] : '';
    var rec = (typeof byZip !== 'undefined' && zip) ? byZip[zip] : null;
    var code = rec ? rec.branch : '';
    var FULL = {CFL:'Central Florida', NFL:'North Florida', SFL:'South Florida'};

    var proj = {
      address   : raw,
      zip       : zip || '',
      city      : rec ? rec.city   : '',
      county    : rec ? rec.county : '',
      regionCode: code,
      branch    : FULL[code] || code || '',
      ahj       : ahj,
      pa        : rec ? rec.pa : '',
      permitEta : permitEta
    };

    try{ sessionStorage.setItem('voltProject', JSON.stringify(proj)); } catch(e){}
    window.location.href = SALES_URL;
  };

  function init(){
    var out = document.getElementById('out');
    if(!out) return;

    if(!document.getElementById('proceedBtn')){
      out.parentNode.insertBefore(btn, out.nextSibling);
    }

    new MutationObserver(function(){
      var t = out.textContent.trim();
      var ok = t.length > 0
            && !out.querySelector('.err-box')
            && !/Analyzing|determining|loading/i.test(t);
      btn.style.display = ok ? 'block' : 'none';
    }).observe(out, {childList:true, subtree:true});
  }

  if(document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
