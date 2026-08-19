import { Composition, Folder } from "remotion";
import { StartupSharkTankExplainer } from "./StartupSharkTankExplainer";
import { AnalysisScene } from "./scenes/AnalysisScene";
import { DebateScene } from "./scenes/DebateScene";
import { FounderInputScene } from "./scenes/FounderInputScene";
import { HookScene } from "./scenes/HookScene";
import { OutcomeScene } from "./scenes/OutcomeScene";
import { PitchScene } from "./scenes/PitchScene";

export function RemotionRoot() {
  return (
    <>
      <Folder name="Explainer-Scenes">
        <Composition
          id="Scene01-Hook"
          component={HookScene}
          durationInFrames={75}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene02-Pitch"
          component={PitchScene}
          durationInFrames={135}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene03-Analysis"
          component={AnalysisScene}
          durationInFrames={165}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene04-FounderInput"
          component={FounderInputScene}
          durationInFrames={135}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene05-Debate"
          component={DebateScene}
          durationInFrames={135}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene06-Outcome"
          component={OutcomeScene}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
      <Composition
        id="StartupSharkTankExplainer"
        component={StartupSharkTankExplainer}
        durationInFrames={750}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
}
