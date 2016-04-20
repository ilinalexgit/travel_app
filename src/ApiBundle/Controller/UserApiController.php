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

            $em = $this->getDoctrine()->getManager();
            $em->persist($user);
            $em->flush();
            $responseArr['success'] = true;
        }

        $response->setData($responseArr);

        return $response;
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

