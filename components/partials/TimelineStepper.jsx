
import * as React from "react";
import { Check, Lock } from "lucide-react";

/**
 * Timeline Stepper Component
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS classes
 * @param {TimelineStep[]} [props.steps] - Array of timeline steps
 * @param {Function} [props.onStepClick] - Callback when step is clicked
 * @param {Function} [props.onSubStepToggle] - Callback when substep is toggled
 */
export default function TimelineStepper({
  className,
  steps = defaultTimelineData,
  onStepClick,
  onSubStepToggle
}) {
  const [stepsState, setStepsState] = React.useState(steps);

  const handleStepClick = (step, index) => {
    if (step.disabled) return;

    if (onStepClick) {
      onStepClick(step);
    }

    setStepsState(prev =>
      prev.map((s, i) => ({
        ...s,
        active: i === index ? !s.active : false
      }))
    );
  };

  const handleSubStepToggle = (stepIndex, subStepIndex) => {
    setStepsState(prev => {
      const newSteps = [...prev];
      const subStep = newSteps[stepIndex].subSteps[subStepIndex];
      subStep.completed = !subStep.completed;

      const allRequiredCompleted = newSteps[stepIndex].subSteps
        ?.filter(sub => sub.required)
        .every(sub => sub.completed);

      if (allRequiredCompleted) {
        newSteps[stepIndex].completed = true;
      }

      if (onSubStepToggle) {
        onSubStepToggle(newSteps[stepIndex], subStep);
      }

      return newSteps;
    });
  };

  const renderContent = (content) => {
    if (typeof content === 'function') {
      return content();
    }
    return <p className="text-muted-foreground mb-4">{content}</p>;
  };

  return (
    <section className={`bg-background py-16 ${className || ''}`}>
      <div className="mx-auto">
        <div className="relative">
          <div className="absolute top-4 left-4 w-0.5 h-[calc(100%-2rem)] bg-gray-200 dark:bg-gray-700" />

          {stepsState.map((step, stepIndex) => (
            <div key={step.id} className="relative mb-8 pl-12">
              {/* Indicator */}
              <div
                className={`absolute top-3 left-0 flex items-center justify-center transition-all duration-300 ${step.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                  }`}
                onClick={() => handleStepClick(step, stepIndex)}
              >
                {step.completed ? (
                  <div className="flex w-8 h-8 items-center justify-center rounded-full bg-green-500">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                ) : step.active ? (
                  <span className="relative flex w-8 h-8">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                    <span className="relative inline-flex w-8 h-8 rounded-full bg-sky-500 items-center justify-center">
                      <span className="w-3 h-3 rounded-full bg-white"></span>
                    </span>
                  </span>
                ) : step.disabled ? (
                  <div className="flex w-8 h-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                    <Lock className="w-4 h-4 text-gray-400" />
                  </div>
                ) : (
                  <div className="flex w-8 h-8 items-center justify-center rounded-full border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
                    <span className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className={`transition-opacity duration-300 ${step.disabled ? 'opacity-50' : ''}`}>
                <div className="flex items-baseline gap-4 mb-2">
                  <h4 className="text-xl font-bold tracking-tight">
                    {step.title}
                  </h4>
                  {step.date && (
                    <span className="text-sm text-gray-500">{step.date}</span>
                  )}
                </div>

                <div className="border rounded-lg shadow-sm bg-white dark:bg-gray-800">
                  <div className="p-6">
                    <div className="mb-4">
                      {renderContent(step.content)}
                    </div>

                    {/* Sub-steps */}
                    {step.subSteps && step.subSteps.length > 0 && (
                      <div className="mt-4 space-y-2 border-t pt-4">
                        <p className="text-sm font-semibold mb-3">
                          Sub-tasks:
                        </p>
                        {step.subSteps.map((subStep, subIndex) => (
                          <div
                            key={subStep.id}
                            className={`flex items-start gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 ${subStep.completed ? 'bg-green-50 dark:bg-green-950/20 hover:bg-green-100 dark:hover:bg-green-950/30' : ''
                              }`}
                            onClick={() => handleSubStepToggle(stepIndex, subIndex)}
                          >
                            <div className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${subStep.completed
                                ? 'bg-green-500 border-green-500'
                                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                              }`}>
                              {subStep.completed && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className={`text-sm font-medium ${subStep.completed ? 'text-green-700 dark:text-green-400' : ''
                                  }`}>
                                  {subStep.title}
                                </p>
                                {!subStep.required && (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                                    Opsional
                                  </span>
                                )}
                              </div>
                              {subStep.content && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {subStep.content}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}