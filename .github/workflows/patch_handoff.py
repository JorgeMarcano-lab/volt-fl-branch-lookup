import os,base64,json,urllib.request,urllib.error
token=os.environ["GH_TOKEN"]; repo=os.environ["REPO"]
H={"Authorization":f"token {token}","Accept":"application/vnd.github+json","Content-Type":"application/json","User-Agent":"handoff-bot"}
def gh(m,p,b=None):
    r=urllib.request.Request(f"https://api.github.com{p}",json.dumps(b).encode() if b else None,H,method=m)
    try:
        with urllib.request.urlopen(r) as x: return json.loads(x.read()),x.status
    except urllib.error.HTTPError as e: return json.loads(e.read()),e.code
src=open("index.html",encoding="utf-8",errors="replace").read()
if "handoff.js" in src: print("already present"); exit(0)
print("injecting...")
idx=src.rfind("</body>"); patched=src[:idx]+"<script src=\"handoff.js\"></script>\n"+src[idx:]
info,_=gh("GET",f"/repos/{repo}/contents/index.html?ref=main")
res,code=gh("PUT",f"/repos/{repo}/contents/index.html",{"message":"[handoff-bot] Restore handoff.js script tag","content":base64.b64encode(patched.encode("utf-8","replace")).decode(),"sha":info["sha"],"branch":"main"})
print("OK commit",res.get("commit",{}).get("sha","?")[:7]) if code in(200,201) else (print("ERROR",code,res.get("message")),exit(1))
