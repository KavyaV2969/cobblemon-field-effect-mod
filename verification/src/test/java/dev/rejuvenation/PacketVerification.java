package dev.rejuvenation;
import dev.rejuvenation.net.FieldPayloads;
import io.netty.buffer.Unpooled;
import net.minecraft.class_2540;
import net.minecraft.class_9139;
import java.util.function.Function;
/** Real installed packet codecs over isolated Netty buffers; no game/client startup. */
public final class PacketVerification {
 private static <T> int verify(class_9139<class_2540,T> codec,Function<String,T> payload,int limit){
  var buf=new class_2540(Unpooled.buffer());
  try{
   var value=payload.apply("{\"battle\":\"test\",\"turn\":4,\"decision\":12,\"field\":\"City → Back Alley\"}");
   codec.encode(buf,value);if(!value.equals(codec.decode(buf)))throw new AssertionError("Packet roundtrip");
   if(buf.readableBytes()!=0)throw new AssertionError("Trailing packet bytes");
   buf.clear();boolean rejected=false;try{codec.encode(buf,payload.apply("x".repeat(limit+1)));}catch(io.netty.handler.codec.EncoderException expected){rejected=true;}
   if(!rejected)throw new AssertionError("Oversized encoded packet accepted");
   buf.clear();buf.method_10788("x".repeat(limit+1),limit+1);rejected=false;
   try{codec.decode(buf);}catch(io.netty.handler.codec.DecoderException expected){rejected=true;}
   if(!rejected)throw new AssertionError("Oversized received packet accepted");
   return 4;
  }finally{buf.release();}
 }
 public static int run(){
  return verify(FieldPayloads.FieldState.CODEC,FieldPayloads.FieldState::new,1<<18)
   +verify(FieldPayloads.Notes.CODEC,FieldPayloads.Notes::new,1<<15)
   +verify(FieldPayloads.MoveEvaluations.CODEC,FieldPayloads.MoveEvaluations::new,1<<18)
   +verify(FieldPayloads.EvaluationRequest.CODEC,FieldPayloads.EvaluationRequest::new,1<<14);
 }
}
