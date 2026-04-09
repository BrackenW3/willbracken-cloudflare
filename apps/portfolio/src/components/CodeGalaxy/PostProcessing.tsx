import { EffectComposer, Bloom } from '@react-three/postprocessing';

export function PostProcessing() {
  return (
    <EffectComposer>
      <Bloom 
        luminanceThreshold={0.2} 
        mipmapBlur 
        intensity={1.5} 
      />
    </EffectComposer>
  );
}
