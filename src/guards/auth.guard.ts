import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  private validateRequest(request: any) {
    
    
    const jwtString = request.headers.authorization.split('Bearer ')[1];
    console.log(jwtString);
    this.authService.verify(jwtString);

    return true;
  }
}