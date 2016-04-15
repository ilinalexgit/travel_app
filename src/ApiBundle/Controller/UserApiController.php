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
}

