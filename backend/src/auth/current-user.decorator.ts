import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { auth } from '../auth';

export type User = typeof auth.$Infer.Session.user;

export const CurrentUser = createParamDecorator((data: unknown, context: ExecutionContext )=> {
	const request = context.switchToHttp().getRequest();
	const user: User = request.user;

	if (data) {
		return user[data as string]
	}

	return user
	
} );	