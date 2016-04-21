<?php

namespace ApiBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use ApiBundle\Entity\User;
use ApiBundle\Entity\Trip;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Constraints\Email;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\Response;
use ApiBundle\Controller\ApiController;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class UserApiController extends Controller
{
    /**
     * @Route("/register", name="user_registration")
     */
    public function registerAction(Request $request)
    {
        $responseArr = array();
        $roles = array('ROLE_USER');

        $user = new User();
        $user->setUsername($request->get('username', NULL));
        $user->setPlainPassword($request->get('password', NULL));
        $user->setEmail($request->get('email', NULL));
        $user->setRoles($roles);

        $validator = $this->get('validator');
        $errors = $validator->validate($user);

        $response = new JsonResponse();
        if (count($errors) > 0) {
            $responseArr['success'] = false;
            $responseArr['errors'] = ApiController::getErrorsTextsArray($errors);
            $response->setStatusCode(Response::HTTP_BAD_REQUEST);
        }else{
            $password = $this->get('security.password_encoder')
                ->encodePassword($user, $user->getPlainPassword());
            $user->setPassword($password);
            $code = md5(uniqid(rand(), true));
            $user->setAccountActivationCode($code);

            $em = $this->getDoctrine()->getManager();
            $em->persist($user);
            $em->flush();
            $responseArr['success'] = true;

            $link = $this->generateUrl(
                'activate',
                array('code' => $user->getAccountActivationCode()),
                UrlGeneratorInterface::ABSOLUTE_URL
            );

            $message = \Swift_Message::newInstance()
                ->setSubject('Welcome to My Trip Planner!')
                ->setFrom('travelapp@gmail.com')
                ->setTo($user->getEmail())
                ->setBody(
                    $this->renderView(
                        'ApiBundle:Emails:registration.html.twig',
                        array('username' => $user->getUsername(), 'password' => $user->getPlainPassword(), 'link' => $link)
                    ),
                    'text/html'
                );
            $this->get('mailer')->send($message);
        }

        $response->setData($responseArr);

        return $response;
    }

    /**
     * @Route("/activate/{code}", name="activate")
     */
    public function activateAction($code, Request $request)
    {
        $message = '';
        $em = $this->getDoctrine()->getManager();
        $userRepo = $em->getRepository('ApiBundle:User');
        $user = $userRepo->findOneBy(array('accountActivationCode' => $code));

        $response = new JsonResponse();
        if(!$user){
            $message = 'Specified code is invalid.';
        }else{
            $user->setIsActive(true);
            $user->setAccountActivationCode(null);

            $em->persist($user);
            $em->flush();

            $message = 'Your account is active.';
        }

        return new Response($message);
    }

    /**
     * @Route("/password_recovery", name="password_recovery")
     */
    public function passwordRecoveryAction(Request $request)
    {
        $responseArr = array();
        $em = $this->getDoctrine()->getManager();
        $userRepo = $em->getRepository('ApiBundle:User');
        $email = $request->get('email', NULL);

        $response = new JsonResponse();
        if (!$email) {
            $responseArr['success'] = false;
            $responseArr['errors'][] = 'Unable to find email.';
            $response->setStatusCode(Response::HTTP_BAD_REQUEST);
        }else{
            $user = $userRepo->findOneBy(array('email' => $email));
            if(!$user){
                $responseArr['success'] = false;
                $responseArr['errors'][] = 'Unable to find user with specified email.';
                $response->setStatusCode(Response::HTTP_BAD_REQUEST);
            }else{
                $now = new \DateTime('now', new \DateTimeZone('UTC'));
                $now->add(new \DateInterval('PT30M'));
                $user->setPasswordRecoveryCode(md5(uniqid(rand(), true)));
                $user->setPasswordRecoveryCodeExpires($now);
                $em->persist($user);
                $em->flush();

                $link = $this->generateUrl(
                    'password_reset',
                    array('code' => $user->getPasswordRecoveryCode()),
                    UrlGeneratorInterface::ABSOLUTE_URL
                );
                $message = \Swift_Message::newInstance()
                    ->setSubject('My Travel Planner - Password Recovery')
                    ->setFrom('travelapp@gmail.com')
                    ->setTo($user->getEmail())
                    ->setBody(
                        $this->renderView(
                            'ApiBundle:Emails:password_recovery.html.twig',
                            array('link' => $link)
                        ),
                        'text/html'
                    );
                $this->get('mailer')->send($message);

                $responseArr['success'] = true;
            }
        }

        $response->setData($responseArr);

        return $response;
    }

    /**
     * @Route("/password_reset/{code}", name="password_reset")
     */
    public function passwordResetAction($code, Request $request)
    {
        date_default_timezone_set('UTC');
        $message = '';
        $em = $this->getDoctrine()->getManager();
        $userRepo = $em->getRepository('ApiBundle:User');
        $user = $userRepo->findOneBy(array('passwordRecoveryCode' => $code));

        $response = new JsonResponse();
        if(!$user){
            $message = 'Specified code is invalid.';
        }else{
            $now = new \DateTime('now', new \DateTimeZone('UTC'));
            $expiresDate = $user->getPasswordRecoveryCodeExpires();
            if ($now >= $expiresDate){
                $message = 'Sorry, your link has expired.';
            }else{
                $newPwd = md5(uniqid(rand(), true));
                $newPwd = substr($newPwd,0,8);
                $password = $this->get('security.password_encoder')
                    ->encodePassword($user, $newPwd);
                $user->setPassword($password);
                $user->setPasswordRecoveryCode('');

                $em->persist($user);
                $em->flush();

                $message = \Swift_Message::newInstance()
                    ->setSubject('My Trip Planner - Password Recovery (Your New Password)')
                    ->setFrom('travelapp@gmail.com')
                    ->setTo($user->getEmail())
                    ->setBody(
                        $this->renderView(
                            'ApiBundle:Emails:password_reset.html.twig',
                            array('pwd' => $newPwd, 'login' => $user->getUsername())
                        ),
                        'text/html'
                    );
                $this->get('mailer')->send($message);

                $message = 'We send you a new password.';
            }
        }

        return new Response($message);
    }

    /**
     * @Route("/user", name="user_show")
     * @Method({"GET"})
     */
    public function userShowAction()
    {
        $user = $this->getUser();

        $response = new JsonResponse();
        if (!$user) {
            $responseArr['success'] = false;
            $response->setStatusCode(Response::HTTP_BAD_REQUEST);
        }else{
            $response->setData($user->getUserAsArray());
        }

        return $response;
    }

    /**
     * @Route("/users", name="users")
     * @Method({"GET"})
     */
    public function usersShowAction(Request $request)
    {
        $doctrine = $this->getDoctrine();
        $users   = $doctrine->getRepository('ApiBundle:User')->fileterByRequest($request);

        $response = new JsonResponse();
        $response->setData($users);
        return $response;
    }

    /**
     * @Route("/users/{id}", name="user_delete")
     * @Method({"DELETE"})
     */
    public function userDeleteAction($id)
    {
        $em = $this->getDoctrine()->getManager();
        $userRepo = $em->getRepository('ApiBundle:User');
        $user = $userRepo->find($id);
        $response = new JsonResponse();
        if (!$user) {
            $responseArr['success'] = false;
            $responseArr['errors'] = 'Unable to find user.';
            $response->setStatusCode(Response::HTTP_BAD_REQUEST);
        }else{
            $em->remove($user);
            $em->flush();
            $responseArr['success'] = true;
        }
        $response->setData($responseArr);
        return $response;
    }

    /**
     * @Route("/users/{id}", name="user_update")
     * @Method({"PUT"})
     */
    public function userUpdateAction($id, Request $request)
    {
        $responseArr = array();
        $em = $this->getDoctrine()->getManager();
        $userRepo = $em->getRepository('ApiBundle:User');

        $user = $userRepo->find($id);
        $response = new JsonResponse();
        if (!$user) {
            $responseArr['success'] = false;
            $responseArr['errors'] = 'Unable to find user.';
            $response->setStatusCode(Response::HTTP_BAD_REQUEST);
        }else{
            $user->setUsername($request->get('username', NULL));
            $user->setPlainPassword('update');
            $password = $request->get('password', NULL);
            $user->setEmail($request->get('email', NULL));
            $is_admin = filter_var($request->get('is_admin', NULL), FILTER_VALIDATE_BOOLEAN);

            if ($is_admin){
                $user->setRoles(array('ROLE_USER','ROLE_ADMIN'));
            }else{
                $user->setRoles(array('ROLE_USER'));
            }

            $validator = $this->get('validator');
            $errors = $validator->validate($user);

            if (count($errors) > 0) {
                $responseArr['success'] = false;
                $responseArr['errors'] = ApiController::getErrorsTextsArray($errors);
                $response->setStatusCode(Response::HTTP_BAD_REQUEST);
            }else{
                if ($password){
                    $password = $this->get('security.password_encoder')
                        ->encodePassword($user, $user->getPlainPassword());
                    $user->setPassword($password);
                }

                $em->persist($user);
                $em->flush();

                $responseArr['success'] = true;
            }
        }

        $response->setData($responseArr);
        return $response;
    }

    /**
     * @Route("/users", name="user_add")
     * @Method({"POST"})
     */
    public function userAddAction(Request $request)
    {
        $responseArr = array();
        $responseArr['errors'] = array();
        $response = new JsonResponse();
        $user = $this->getUser();

        $user = new User();
        $user->setUsername($request->get('username', NULL));
        $user->setPlainPassword($request->get('password', NULL));
        $user->setEmail($request->get('email', NULL));
        $user->setIsActive(true);
        $is_admin = filter_var($request->get('is_admin', NULL), FILTER_VALIDATE_BOOLEAN);

        if ($is_admin){
            $user->setRoles(array('ROLE_USER','ROLE_ADMIN'));
        }else{
            $user->setRoles(array('ROLE_USER'));
        }

        $validator = $this->get('validator');
        $errors = $validator->validate($user);

        if (count($errors) > 0) {
            $responseArr['success'] = false;
            $responseArr['errors'] = ApiController::getErrorsTextsArray($errors);
            $response->setStatusCode(Response::HTTP_BAD_REQUEST);
        }else{
            $em = $this->getDoctrine()->getManager();
            $password = $this->get('security.password_encoder')
                ->encodePassword($user, $user->getPlainPassword());
            $user->setPassword($password);

            $em->persist($user);
            $em->flush();
            $responseArr['success'] = true;
            $responseArr['user_id'] = $user->getId();
        }

        $response->setData($responseArr);
        return $response;
    }
}

