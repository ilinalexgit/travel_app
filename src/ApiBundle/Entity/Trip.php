<?php
namespace ApiBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Table(name="trip")
 * @ORM\Entity(repositoryClass="ApiBundle\Entity\TripRepository")
 */
class Trip
{
    /**
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\Column(name="start_dt", type="datetime")
     * @Assert\NotBlank()
     * @Assert\Date()
     */
    protected $start_dt;

    /**
     * @ORM\Column(name="end_dt", type="datetime", nullable=true)
     * @Assert\Date()
     */
    protected $end_dt;

    /**
     * @ORM\Column(name="created_dt", type="datetime")
     * @Assert\Date()
     */
    protected $created_dt;

    /**
     * @ORM\Column(name="destination", type="string")
     * @Assert\NotBlank()
     */
    protected $destination;

    /**
     * @ORM\Column(name="departure", type="string", nullable=true)
     */
    protected $departure;

    /**
     * @ORM\Column(name="description", type="text", nullable=true)
     */
    protected $description;

    /**
     * @ORM\ManyToOne(targetEntity="ApiBundle\Entity\User", inversedBy="trips")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id")
     */
    private $user;



    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set startDt
     *
     * @param \DateTime $startDt
     *
     * @return Trip
     */
    public function setStartDt($startDt)
    {
        $this->start_dt = $startDt;

        return $this;
    }

    /**
     * Get startDt
     *
     * @return \DateTime
     */
    public function getStartDt()
    {
        return $this->start_dt;
    }

    /**
     * Set endDt
     *
     * @param \DateTime $endDt
     *
     * @return Trip
     */
    public function setEndDt($endDt)
    {
        $this->end_dt = $endDt;

        return $this;
    }

    /**
     * Get endDt
     *
     * @return \DateTime
     */
    public function getEndDt()
    {
        return $this->end_dt;
    }

    /**
     * Set createdDt
     *
     * @param \DateTime $createdDt
     *
     * @return Trip
     */
    public function setCreatedDt($createdDt)
    {
        $this->created_dt = $createdDt;

        return $this;
    }

    /**
     * Get createdDt
     *
     * @return \DateTime
     */
    public function getCreatedDt()
    {
        return $this->created_dt;
    }

    /**
     * Set destination
     *
     * @param string $destination
     *
     * @return Trip
     */
    public function setDestination($destination)
    {
        $this->destination = $destination;

        return $this;
    }

    /**
     * Get destination
     *
     * @return string
     */
    public function getDestination()
    {
        return $this->destination;
    }

    /**
     * Set departure
     *
     * @param string $departure
     *
     * @return Trip
     */
    public function setDeparture($departure)
    {
        $this->departure = $departure;

        return $this;
    }

    /**
     * Get departure
     *
     * @return string
     */
    public function getDeparture()
    {
        return $this->departure;
    }

    /**
     * Set description
     *
     * @param string $description
     *
     * @return Trip
     */
    public function setDescription($description)
    {
        $this->description = $description;

        return $this;
    }

    /**
     * Get description
     *
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Set user
     *
     * @param \ApiBundle\Entity\User $user
     *
     * @return Trip
     */
    public function setUser(\ApiBundle\Entity\User $user = null)
    {
        $this->user = $user;

        return $this;
    }

    /**
     * Get user
     *
     * @return \ApiBundle\Entity\User
     */
    public function getUser()
    {
        return $this->user;
    }

    public function getTripAsArray(){
        $arr = array();
        $arr['description'] = $this->getDescription();
        $arr['destination'] = $this->getDestination();
        $arr['start_dt'] = $this->getStartDt();
        $arr['end_dt'] = $this->getEndDt();
        return $arr;
    }
}
