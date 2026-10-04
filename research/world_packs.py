"""Read NBT metadata without opening or changing an existing Minecraft world."""
from pathlib import Path
import gzip,io,struct,json
ROOT=Path(__file__).resolve().parents[2]
def read_nbt(file):
    stream=io.BytesIO(gzip.decompress(file.read_bytes()))
    def n(fmt):return struct.unpack('>'+fmt,stream.read(struct.calcsize('>'+fmt)))[0]
    def text():return stream.read(n('H')).decode('utf-8',errors='replace')
    def payload(kind):
        if kind in range(1,7):return n({1:'b',2:'h',3:'i',4:'q',5:'f',6:'d'}[kind])
        if kind==7:return stream.read(n('i'))
        if kind==8:return text()
        if kind==9:
            subtype=n('B');return [payload(subtype) for _ in range(n('i'))]
        if kind==10:
            result={}
            while (subtype:=n('B'))!=0:
                key=text();result[key]=payload(subtype)
            return result
        if kind in [11,12]:return [n('i' if kind==11 else 'q') for _ in range(n('i'))]
        raise ValueError('Unknown NBT type '+str(kind))
    kind=n('B');text();return payload(kind)
out={}
for p in (ROOT/'saves').glob('*/level.dat'):
    data=read_nbt(p)['Data'];out[str(p.relative_to(ROOT))]={'packs':data.get('DataPacks'),'version':data.get('Version')}
(ROOT/'rejuvenation/research/world-datapack-metadata.json').write_text(json.dumps(out,indent=2)+'\n')
print(json.dumps(out,indent=2))
