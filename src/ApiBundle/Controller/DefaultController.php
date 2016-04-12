<?php

namespace ApiBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use ApiBundle\Entity\User;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Constraints\Email;

class DefaultController extends Controller
{
    /**
     * @Route("/123")
     */
    public function indexAction(Request $request)
    {
        $responseArr = array();
        $username = $request->request->get('username', NULL);
        $password = $request->request->get('password', NULL);
        $email = $request->request->get('email', NULL);

        $emailConstraint = new Email();

        $errorList = $this->get('validator')->validateValue(
            $email,
            $emailConstraint
        );

        var_dump($errorList);die;

        if ($username && $password && $email){

        }else{
            $responseArr['success'] = false;
            $responseArr['message'] = 'Invalid parameters.';
        }

        /*$response = new JsonResponse();
        $response->setData($responseArr);

        $user = new User();
        $form = $this->createForm(UserType::class, $user);

        // 2) handle the submit (will only happen on POST)
        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {

            // 3) Encode the password (you could also do this via Doctrine listener)
            $password = $this->get('security.password_encoder')
                ->encodePassword($user, $user->getPlainPassword());
            $user->setPassword($password);

            // 4) save the User!
            $em = $this->getDoctrine()->getManager();
            $em->persist($user);
            $em->flush();

            // ... do any other work - like sending them an email, etc
            // maybe set a "flash" success message for the user

            return $this->redirectToRoute('replace_with_some_route');
        }

        return $this->render(
            'registration/register.html.twig',
            array('form' => $form->createView())
        );

        return $this->render('ApiBundle:Default:index.html.twig');*/
    }
}
