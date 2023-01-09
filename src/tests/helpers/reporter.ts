import {DisplayProcessor, SpecReporter, StacktraceOption} from 'jasmine-spec-reporter';

class customProcessor extends DisplayProcessor {
  public displayJasmineStarted(info: jasmine.JasmineStartedInfo, log: string): string {
    return `TypeScript ${log}`;
  }
}

jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(new SpecReporter({
    spec: {
        displayStacktrace: StacktraceOption.PRETTY,
        displayDuration: true
    },
    customProcessors: [customProcessor]
}));