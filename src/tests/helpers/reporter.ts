import {DisplayProcessor, SpecReporter, StacktraceOption} from 'jasmine-spec-reporter';

class customProcessor extends DisplayProcessor {
  public displayJasmineStarted(info: jasmine.JasmineStartedInfo, log: string): string {
    return `${log}`;
  }
}

jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(new SpecReporter({
    spec: {
        displayStacktrace: StacktraceOption.NONE,
        displayDuration: true
    },
    customProcessors: [customProcessor]
}));