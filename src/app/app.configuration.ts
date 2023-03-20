import { Injectable } from '@angular/core';
import { PxConfiguration, PxVersion } from 'projects/lib/src/public-api';

@Injectable()
export class AppConfiguration extends PxConfiguration {
  clientName: string = "Proffix REST API Debugger";
  public get requiredWebserviceVersion(): PxVersion {
    return { Major: 4, Minor: 23, Patch: 1 };
  }
  public get requiredLicencedModules(): string[] {
    return ['VOL'];
  }
}