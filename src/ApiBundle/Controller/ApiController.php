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

class ApiController extends Controller
{
    /**
     * @Route("/trips/{id}", name="trip_show")
     * @Method({"GET"})
     */
    public function tripShowAction($id)
    {
        $responseArr = array();
        $em = $this->getDoctrine()->getManager();
        $tripRepo = $em->getRepository('ApiBundle:Trip');

        $trip = $tripRepo->find($id);
        $response = new JsonResponse();
        if (!$trip) {
            $responseArr['success'] = false;
            $responseArr['errors'] = 'Unable to find trip.';
            $response->setData($responseArr);
            $response->setStatusCode(Response::HTTP_BAD_REQUEST);
        }else{
            $response->setData($trip->getTripAsArray());
        }

        return $response;
    }

    /**
     * @Route("/trips/{id}", name="trip_update")
     * @Method({"PUT"})
     */
    public function tripUpdateAction($id, Request $request)
    {
        $responseArr = array();
        $em = $this->getDoctrine()->getManager();
        $tripRepo = $em->getRepository('ApiBundle:Trip');

        $trip = $tripRepo->find($id);
        $response = new JsonResponse();
        if (!$trip) {
            $responseArr['success'] = false;
            $responseArr['errors'] = 'Unable to find trip.';
            $response->setStatusCode(Response::HTTP_BAD_REQUEST);
        }else{
            if ($request->get('start_dt', NULL) && isset($request->get('start_dt', NULL)['date'])){
                $start_dt = $this->getValidDateObject($request->get('start_dt', NULL)['date']);
                $trip->setStartDt($start_dt);
            }

            if ($request->get('end_dt', NULL) && isset($request->get('end_dt', NULL)['date'])){
                $end_dt = $this->getValidDateObject($request->get('end_dt', NULL)['date']);
                $trip->setEndDt($end_dt);
            }

            if ($request->get('description', NULL)){
                $trip->setDescription($request->get('description', NULL));
            }

            if ($request->get('destination', NULL)){
                $trip->setDestination($request->get('destination', NULL));
            }

            $validator = $this->get('validator');
            $errors = $validator->validate($trip);

            if (count($errors) > 0) {
                $responseArr['success'] = false;
                $responseArr['errors'] = $this->getErrorsTextsArray($errors);
                $response->setStatusCode(Response::HTTP_BAD_REQUEST);
            }else{
                $em->persist($trip);
                $em->flush();

                $responseArr['success'] = true;
            }
        }

        $response->setData($responseArr);
        return $response;
    }

    /**
     * @Route("/trips/{id}", name="trip_delete")
     * @Method({"DELETE"})
     */
    public function tripDeleteAction($id)
    {
        $em = $this->getDoctrine()->getManager();
        $tripRepo = $em->getRepository('ApiBundle:Trip');
        $trip = $tripRepo->find($id);
        $response = new JsonResponse();
        if (!$trip) {
            $responseArr['success'] = false;
            $responseArr['errors'] = 'Unable to find trip.';
            $response->setStatusCode(Response::HTTP_BAD_REQUEST);
        }else{
            $em->remove($trip);
            $em->flush();
            $responseArr['success'] = true;
        }
        $response->setData($responseArr);
        return $response;
    }

    /**
     * @Route("/trips", name="trip_add")
     * @Method({"POST"})
     */
    public function tripAddAction(Request $request)
    {
        $responseArr = array();
        $responseArr['errors'] = array();
        $response = new JsonResponse();
        $user = $this->getUser();

        $start_dt = $this->getValidDateObject($request->get('start_dt', NULL)['date']);
        $end_dt = $this->getValidDateObject($request->get('end_dt', NULL)['date']);

        $now = new \DateTime('now', new \DateTimeZone('UTC'));

        $trip = new Trip();
        $trip->setDescription($request->get('description', NULL));
        $trip->setDeparture($request->get('departure', NULL));
        $trip->setDestination($request->get('destination', NULL));
        $trip->setEndDt($end_dt);
        $trip->setStartDt($start_dt);
        $trip->setCreatedDt($now);
        $trip->setUser($user);

        $validator = $this->get('validator');
        $errors = $validator->validate($trip);

        if (count($errors) > 0) {
            $responseArr['success'] = false;
            $responseArr['errors'] = $this->getErrorsTextsArray($errors);
            $response->setStatusCode(Response::HTTP_BAD_REQUEST);
        }else{
            $em = $this->getDoctrine()->getManager();
            $em->persist($trip);
            $em->flush();
            $responseArr['success'] = true;
            $responseArr['trip_id'] = $trip->getId();
        }

        $response->setData($responseArr);
        return $response;
    }

    /**
     * @Route("/trips", name="trips")
     * @Method({"GET"})
     */
    public function tripsShowAction(Request $request)
    {
        $doctrine = $this->getDoctrine();
        $user = $this->getUser();
        $trips   = $doctrine->getRepository('ApiBundle:Trip')->fileterByRequest($request, $user->getId());

        $response = new JsonResponse();
        $response->setData($trips);
        return $response;
    }

    static function getErrorsTextsArray($errors){
        $result = array();
        foreach ($errors as $key => $error) {
            $result[] = $error->getPropertyPath() .': '. $error->getMessage();
        }
        return $result;
    }

    protected function getValidDateObject($dateString){
        if ($dateString){
            try{
                $obj = new \DateTime($dateString);
                $obj->setTime(0,0,0);
                return $obj;
            }catch (\Exception $e){
                return 'Invalid date.';
            }
        }else{
            return NULL;
        }
    }
}

