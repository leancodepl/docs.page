import { SlugProperties } from './properties';
import { isExternalLink } from './components/Link';

export enum ErrorType {
  repositoryNotFound,
  pageNotFound,
  serverError,
}
export class RenderError {
  public static repositoryNotFound(properties: SlugProperties) {
    return new RenderError(404, ErrorType.repositoryNotFound, properties);
  }

  public static pageNotFound(properties: SlugProperties) {
    return new RenderError(404, ErrorType.pageNotFound, properties);
  }

  public static serverError(properties: SlugProperties) {
    return new RenderError(500, ErrorType.serverError, properties);
  }

  public readonly statusCode: number;
  public readonly errorType: ErrorType;
  public readonly properties: SlugProperties;

  private constructor(statusCode: number, errorType: ErrorType, properties?: SlugProperties) {
    this.statusCode = statusCode;
    this.errorType = errorType;
    this.properties = properties;
  }
}

export function redirect(link: string, properties?: SlugProperties) {
  let destination: string;

  if (!properties || isExternalLink(link)) {
    destination = link;
  } else {
    if (!link.startsWith('/')) {
      link = `/${link}`;
    }

    destination = `/${properties.base}${link}`;
  }

  return {
    redirect: {
      destination,
      permanent: true,
    },
    // TODO: Is this used on redirect?
    revalidate: 3600,
  };
}
