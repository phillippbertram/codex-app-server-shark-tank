import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { AnalysisScene } from "./scenes/AnalysisScene";
import { DebateScene } from "./scenes/DebateScene";
import { FounderInputScene } from "./scenes/FounderInputScene";
import { HookScene } from "./scenes/HookScene";
import { OutcomeScene } from "./scenes/OutcomeScene";
import { PitchScene } from "./scenes/PitchScene";

export function StartupSharkTankExplainer() {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={75} name="Hook">
        <HookScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 15 })}
      />
      <TransitionSeries.Sequence durationInFrames={135} name="Pitch">
        <PitchScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 15 })}
      />
      <TransitionSeries.Sequence durationInFrames={165} name="Agent analysis">
        <AnalysisScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 15 })}
      />
      <TransitionSeries.Sequence durationInFrames={135} name="Founder input">
        <FounderInputScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 15 })}
      />
      <TransitionSeries.Sequence durationInFrames={135} name="Bull vs. bear debate">
        <DebateScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 15 })}
      />
      <TransitionSeries.Sequence durationInFrames={180} name="Outcome">
        <OutcomeScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
}
