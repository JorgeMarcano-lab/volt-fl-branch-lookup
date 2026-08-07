/* Volt - Branch Lookup -> Sales Breakdown handoff v7
   Reads data from window._voltLastResult instead of the DOM
*/
(function(){
  var SALES_URL = 'sales-breakdown.html';

  var btn = document.createElement('button');
  btn.id = 'proceedBtn';
  btn.textContent = 'Continue to Project \u2192';
  btn.style.cssText = [
    'display:none',
    'margin:18px auto 0',
    'padding:13px 22px',
    'background:#f4c537',
    'color:#141414',
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
  btn.onmouseover = function(){ this.style.background = '#ffd759'; };
  btn.onmouseout  = function(){ this.style.background = '#f4c537'; };

  btn.onclick = function(){
    var d = window._voltLastResult || {};
    var raw = (document.getElementById('addr') || {}).value || d.raw || '';

    // Get ETA from AHJ_ETA map if available
    var permitEta = '';
    if(d.ahj && typeof AHJ_ETA !== 'undefined'){
      var etaVal = AHJ_ETA[d.ahj];
      if(etaVal !== undefined) permitEta = String(etaVal);
    }
    // Fallback: read from DOM
    if(!permitEta){
      var out = document.getElementById('out');
      if(out){
        var etaEl = out.querySelector('.fv[style*="font-size:1rem"], .fv[style*="font-size: 1rem"]');
        if(etaEl){
          var etaTxt = etaEl.textContent.trim();
          if(/same.?day/i.test(etaTxt)){ permitEta = '0'; }
          else { var nm = etaTxt.match(/\d+/); if(nm) permitEta = nm[0]; }
        }
      }
    }

    var FULL = {CFL:'Central Florida', NFL:'North Florida', SFL:'South Florida'};
    var code = d.branch || '';

    var proj = {
      address   : raw,
      zip       : d.zip || '',
      city      : d.city || '',
      county    : d.county || '',
      regionCode: code,
      branch    : FULL[code] || code || '',
      ahj       : d.ahj || '',
      pa        : d.pa || '',
      permitEta : permitEta,
      nameOnTitle: d.nameOnTitle || '',
      roofAge   : d.roofAge || '',
      prevPermits: d.prevPermits || ''
    };

    try{ sessionStorage.setItem('voltProject', JSON.stringify(proj)); } catch(e){}
    // Verify save worked
    var saved = '';
    try{ saved = sessionStorage.getItem('voltProject') || 'EMPTY'; }catch(e){ saved = 'ERROR'; }
    if(!saved || saved === 'EMPTY'){
      alert('ERROR: sessionStorage is empty. Please try again.');
      return;
    }
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
