const arrayEnvironments = ["dev", "prd"] as const;
type Environment = (typeof arrayEnvironments)[number];

export type ConfigParameters = {
  VpcProp: {
    Cidr: string;
  };
};

interface ISytemConfig {
  getSystemConfig(): ConfigParameters;
}

class DevConfig implements ISytemConfig {
  getSystemConfig(): ConfigParameters {
    return {
      VpcProp: {
        Cidr: "10.10.0.0/16",
      },
    };
  }
}

class PrdConfig implements ISytemConfig {
  getSystemConfig(): ConfigParameters {
    return {
      VpcProp: {
        Cidr: "10.20.0.0/16",
      },
    };
  }
}

const SystemMap = new Map<Environment, ISytemConfig>([
  ["dev", new DevConfig()],
  ["prd", new PrdConfig()],
]);

export const getSystemConfig = (env: Environment): ConfigParameters => {
  const system = SystemMap.get(env);
  if (system == null) {
    throw new Error("Please specify like `cdk deploy -c env=dev`");
  }
  return system.getSystemConfig();
};
